const ManagedProxy = require('./Proxy/ManagedProxy');
const { patchVm } = require('./NodeProxies');

const isNyc = !! global.__coverage__;
const { normalize } = require('path');
const { compile } = require('@jymfony/compiler');

const Storage = function () {};
Storage.prototype = {};

let codeCache = new Storage();
let _cache = new Storage();

let { resolve } = require;
if (__jymfony.version_compare(process.versions.node, '12.0.0', '<')) {
    resolve = (id, { paths } = { paths: [ __dirname ]}) => {
        if (id.startsWith('.')) {
            return require.resolve(id, { paths });
        }

        return require.resolve(id, { paths: [ paths[0] + '/node_modules' ] });
    };
}

require.extensions['.ts'] = require.extensions['.ts'] ||
    ((m, filename) => __jymfony.autoload.classLoader.loadFile(filename));

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 * because the buffer-to-string conversion in `fs.readFileSync()`
 * translates it to FEFF, the UTF-16 BOM.
 */
const stripBOM = (content) => 0xFEFF === content.charCodeAt(0) ? content.slice(1) : content;

// From node source:/lib/internal/modules/cjs/helpers.js
const builtinLibs = [
    'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'crypto',
    'dgram', 'dns', 'domain', 'events', 'fs', 'fs/promises', 'http', 'http2', 'https', 'net',
    'os', 'path', 'perf_hooks', 'punycode', 'querystring', 'readline', 'repl',
    'stream', 'string_decoder', 'tls', 'trace_events', 'tty', 'url', 'util',
    'v8', 'vm', 'worker_threads', 'zlib',
];

const builtinRequire = __jymfony.version_compare(process.versions.node, '14.0.0', '<') ? id => {
    if (id.startsWith('node:')) {
        id = id.substring(5);
    }

    if ('fs/promises' === id) {
        return require('fs').promises;
    }

    return require(id);
} : require;

/**
 * Patching-replacement for "require" function in Autoloader component.
 *
 * @internal
 * @memberOf Jymfony.Component.Autoloader
 */
class ClassLoader {
    /**
     * @type {Jymfony.Component.Autoloader.Finder}
     *
     * @private
     */
    _finder;

    /**
     @type {import("node:path")}
     *
     * @private
     */
    _path;

    /**
     * @type {import("node:vm")}
     *
     * @private
     */
    _vm;

    /**
     * @type {import("node:vm")}
     *
     * @private
     */
    _patchedVm;

    /**
     * @type {Set<string>}
     *
     * @private
     */
    _compilerIgnorelist = new Set();

    /**
     * Constructor
     *
     * @param {Jymfony.Component.Autoloader.Finder} finder
     * @param {import("node:path")} path
     * @param {import("node:vm")} vm
     */
    constructor(finder, path, vm) {
        this._finder = finder;
        this._path = path;
        this._vm = vm;
        this._patchedVm = patchVm(this._vm);
        this._compilerIgnorelist = new Set(
            (process.env.JYMFONY_COMPILER_IGNORE || '')
                .split(',')
                .map(v => __jymfony.trim(v))
                .filter(v => '' !== v)
                .map(v => v.startsWith('.') ? path.resolve(process.cwd(), v) : v)
        );
    }

    /**
     * Clears the code/compiler cache.
     */
    static clearCache(prefix = null) {
        if (null === prefix) {
            codeCache = new Storage();
            _cache = new Storage();
        } else {
            prefix = new RegExp('^' + __jymfony.regex_quote(normalize(prefix)));
            for (const fn of Object.keys(_cache)) {
                if (! fn.match(prefix)) {
                    continue;
                }

                delete _cache[fn];
                delete codeCache[fn];
            }
        }
    }

    /**
     * Loads a class.
     *
     * @param {string} fn
     * @param {string} namespace
     *
     * @returns {*}
     */
    loadClass(fn, namespace) {
        const exports = this.loadFile(fn, {}, namespace);

        return exports.__esModule ? exports.default : exports;
    }

    /**
     * Loads a file and returns the file exports.
     *
     * @param {string} fn
     * @param {*} [exports]
     * @param {string} [namespace]
     *
     * @returns {*}
     */
    loadFile(fn, exports = {}, namespace = undefined) {
        fn = this._path.resolve(fn);
        if (_cache[fn]) {
            return _cache[fn];
        }

        if (require.cache[fn]) {
            try {
                return _cache[fn] = require(fn);
            } catch (e) {
                if ('MODULE_NOT_FOUND' !== e.code) {
                    throw e;
                }
            }
        }

        return _cache[fn] = this._doLoadFile(fn, exports, namespace);
    }

    /**
     * Gets a file code.
     *
     * @param {string} fn
     * @param {string} [namespace]
     *
     * @returns {{code: string}}
     */
    getCode(fn, namespace = '') {
        if (codeCache[fn]) {
            return codeCache[fn];
        }

        const code = stripBOM(this._finder.load(fn));
        const program = compile(code, fn, {
            debug: __jymfony.autoload.debug,
            namespace,
            asFunction: true,
        });

        return codeCache[fn] = {
            code: program,
        };
    }

    /**
     * Internal file loader.
     *
     * @param {string} fn
     * @param {*} exports
     * @param {string} namespace
     *
     * @returns {*}
     *
     * @private
     */
    _doLoadFile(fn, exports, namespace) {
        const module = this._getModuleObject(fn, exports);
        const dirname = module.paths[0];
        const opts = isNyc ? fn : {
            filename: fn,
            produceCachedData: false,
        };

        const req = id => {
            if ('@jymfony/autoloader' === id) {
                return require('..');
            }

            if ('node:vm' === id || 'vm' === id) {
                return this._patchedVm;
            }

            if (id.startsWith('node:') || builtinLibs.includes(id) || this._compilerIgnorelist.has(id)) {
                return builtinRequire(id);
            }

            if (id.startsWith('.')) {
                id = this._path.resolve(dirname, id);
            }

            id = resolve(id, { paths: [ dirname ] });
            if (! id.endsWith('.js') && ! id.endsWith('.ts') && ! id.endsWith('.mjs')) {
                return require(id);
            }

            return this.loadFile(id);
        };

        req.extensions = require.extensions;
        req.nocompile = id => require(id);
        req.cache = require.cache;

        require.cache[fn] = module;
        _cache[fn] = module.exports;

        req.proxy = id => {
            if (builtinLibs.includes(id)) {
                return builtinRequire(id);
            }

            id = resolve(id, { paths: [ dirname ] });
            if (_cache[id]) {
                return _cache[id];
            }

            const exports = function () {};
            const module = this._getModuleObject(id, exports);

            const code = this.getCode(id, namespace);
            const opts = isNyc ? id : {
                filename: id,
                produceCachedData: false,
            };

            return _cache[id] = new ManagedProxy(exports, proxy => {
                proxy.initializer = null;
                proxy.target = exports;

                this._vm.runInThisContext(code.code, opts)(module.exports, req, module, id, dirname);
                _cache[id] = proxy.target = module.exports;

                return null;
            });
        };

        req.optional = (id, asObject = false) => {
            try {
                return req(id);
            } catch {
                return asObject ? {} : undefined;
            }
        };

        req.resolve = (id, options = {}) => {
            return resolve(id, { paths: [ dirname ], ...options });
        };

        let _pending;
        const code = this.getCode(fn, namespace);
        try {
            this._vm.runInThisContext(code.code, opts)(module.exports, req, module, fn, dirname);
        } catch (e) {
            delete _cache[fn];
            delete require.cache[fn];

            throw e;
        } finally {
            if (_pending) {
                Object.isExtensible(_pending); // Use isExtensible to initialize object
            }
        }

        require.cache[fn] = module;

        return _cache[fn] = module.exports;
    }

    _getModuleObject(fn, exports) {
        return {
            children: [],
            exports,
            filename: fn,
            id: fn,
            loaded: false,
            parent: module,
            paths: [ this._path.dirname(fn) ],
            require: require,
        };
    }
}

module.exports = ClassLoader;
