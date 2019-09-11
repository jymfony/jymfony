try {
    require('@jymfony/util');
} catch (e) {
    require('../../../util');
}

let Compiler;
let Parser;
let AST;

const DescriptorStorage = require('./DescriptorStorage');
const ManagedProxy = require('./Proxy/ManagedProxy');
const isNyc = !! global.__coverage__;

const Generator = require('./Parser/SourceMap/Generator');
const StackHandler = require('./Parser/SourceMap/StackHandler');
const Storage = function () {};
Storage.prototype = {};

let codeCache = new Storage();
let _cache = new Storage();

let { resolve } = require;
if (__jymfony.version_compare(process.versions.v8, '10.0.0', '<')) {
    resolve = (id, { paths }) => {
        if (id.startsWith('.')) {
            return require.resolve(id, { paths });
        }

        return require.resolve(id, { paths: [ paths[0] + '/node_modules' ] });
    };
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 * because the buffer-to-string conversion in `fs.readFileSync()`
 * translates it to FEFF, the UTF-16 BOM.
 */
function stripBOM(content) {
    if (0xFEFF === content.charCodeAt(0)) {
        content = content.slice(1);
    }
    return content;
}

// From node source:/lib/internal/modules/cjs/helpers.js
const builtinLibs = [
    'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'crypto',
    'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'http2', 'https', 'net',
    'os', 'path', 'perf_hooks', 'punycode', 'querystring', 'readline', 'repl',
    'stream', 'string_decoder', 'tls', 'trace_events', 'tty', 'url', 'util',
    'v8', 'vm', 'worker_threads', 'zlib',
];

/**
 * Patching-replacement for "require" function in Autoloader component.
 *
 * @internal
 * @memberOf Jymfony.Component.Autoloader
 */
class ClassLoader {
    /**
     * Constructor
     *
     * @param {Jymfony.Component.Autoloader.Finder} finder
     * @param {path} path
     * @param {vm} vm
     */
    constructor(finder, path, vm) {
        /**
         * @type {Jymfony.Component.Autoloader.Finder}
         *
         * @private
         */
        this._finder = finder;

        /**
         * @type {path}
         *
         * @private
         */
        this._path = path;

        /**
         * @type {vm}
         *
         * @private
         */
        this._vm = vm;

        /**
         * @type {Jymfony.Component.Autoloader.DescriptorStorage}
         *
         * @private
         */
        this._descriptorStorage = new DescriptorStorage(this);

        if (undefined === Compiler) {
            Compiler = require('./Parser/Compiler');
            Parser = require('./Parser/Parser');
            AST = require('./Parser/AST');
        }
    }

    /**
     * Clears the code/compiler cache.
     */
    static clearCache() {
        codeCache = new Storage();
        _cache = new Storage();
    }

    /**
     * Loads a class.
     *
     * @param {string} fn
     * @param {*} self
     *
     * @returns {*}
     */
    loadClass(fn, self) {
        const exports = this.loadFile(fn, self);

        return exports.__esModule ? exports.default : exports;
    }

    /**
     * Loads a file and returns the file exports.
     *
     * @param {string} fn
     * @param {*} self
     * @param {*} exports
     *
     * @returns {*}
     */
    loadFile(fn, self, exports = {}) {
        fn = this._path.resolve(fn);
        if (_cache[fn]) {
            return _cache[fn];
        }

        return _cache[fn] = this._doLoadFile(fn, self, exports);
    }

    /**
     * Gets a file code.
     *
     * @param {string} fn
     *
     * @returns {{code: string, program: Jymfony.Component.Autoloader.Parser.AST.Program}}
     */
    getCode(fn) {
        if (codeCache[fn]) {
            return codeCache[fn];
        }

        let code = stripBOM(this._finder.load(fn)), program = null;
        const sourceMapGenerator = new Generator({ file: fn });
        const descriptorStorage = this._descriptorStorage;

        try {
            this._descriptorStorage = this._descriptorStorage.setFile(fn);
            const parser = new Parser(this._descriptorStorage);
            const compiler = new Compiler(sourceMapGenerator);

            program = parser.parse(code);
            program.prepare();

            const p = new AST.Program(program.location);
            p.add(new AST.ParenthesizedExpression(null,
                new AST.FunctionExpression(null, new AST.BlockStatement(null, [
                    new AST.StringLiteral(null, '\'use strict\''),
                    ...program.body,
                ]), null, [
                    new AST.Identifier(null, 'exports'),
                    new AST.Identifier(null, 'require'),
                    new AST.Identifier(null, 'module'),
                    new AST.Identifier(null, '__filename'),
                    new AST.Identifier(null, '__dirname'),
                    new AST.Identifier(null, '__self'),
                ])
            ));

            code = compiler.compile(p);
            StackHandler.registerSourceMap(fn, sourceMapGenerator.toJSON().mappings);
        } catch (err) {
            // Compiler have failed. Code is unpatched, but can be included.

            if (! (err instanceof SyntaxError)) {
                throw err;
            } else {
                console.warn('Syntax error while parsing ' + fn + ': ' + err.message);
            }
        } finally {
            this._descriptorStorage = descriptorStorage;
        }

        return codeCache[fn] = {
            code,
            program,
        };
    }

    /**
     * Internal file loader.
     *
     * @param {string} fn
     * @param {*} self
     * @param {*} exports
     *
     * @returns {*}
     *
     * @private
     */
    _doLoadFile(fn, self, exports) {
        const module = this._getModuleObject(fn, exports);
        const dirname = module.paths[0];
        const opts = isNyc ? fn : {
            filename: fn,
            produceCachedData: false,
        };

        const req = id => {
            if (builtinLibs.includes(id)) {
                return require(id);
            }

            id = resolve(id, { paths: [ dirname ] });
            if (! id.endsWith('.js')) {
                return require(id);
            }

            return this.loadFile(id, null);
        };

        _cache[fn] = module.exports;
        req.proxy = id => {
            if (builtinLibs.includes(id)) {
                return require(id);
            }

            id = require.resolve(id, { paths: [ dirname ] });
            if (_cache[id]) {
                return _cache[id];
            }

            const code = this.getCode(id);
            const exports = {};

            return _cache[id] = new ManagedProxy(exports, proxy => {
                proxy.initializer = null;
                proxy.target = exports;

                const module = this._getModuleObject(id, exports);
                const dirname = module.paths[0];

                this._vm.runInThisContext(code.code, opts)(module.exports, req, module, id, dirname, null);
                proxy.target = module.exports;

                return null;
            });
        };

        this._vm.runInThisContext(this.getCode(fn).code, opts)(module.exports, req, module, fn, dirname, self);

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
