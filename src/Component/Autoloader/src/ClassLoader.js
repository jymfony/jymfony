const { Generator, registerSourceMap } = require('@jymfony/compiler/src/SourceMap');
const ManagedProxy = require('./Proxy/ManagedProxy');
const CircularDependencyException = require('./Exception/CircularDependencyException');

let Typescript;
let TypescriptConfig;

try {
    Typescript = require('typescript');
    TypescriptConfig = {
        sourceMap: true,
        sourceRoot: '/',
        inlineSourceMap: false,
        inlineSources: false,
        declaration: true,
        module: Typescript.ModuleKind.ESNext,
        target: Typescript.ScriptTarget.ES2017,
        noResolve: true,
        isolatedModules: true,
        strict: true,
    };
} catch (e) {
    // @ignoreException
}

let Compiler;
let Parser;
let AST;

const isNyc = !! global.__coverage__;
const { dirname, normalize, resolve: pathResolve } = require('path');

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

if (Typescript) {
    require.extensions['.ts'] = require.extensions['.ts'] ||
        ((m, filename) => __jymfony.autoload.classLoader.loadFile(filename));
}

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
    if ('fs/promises' === id) {
        return require('fs').promises;
    }

    return require(id);
} : require;

const sourceMapGenerator = new Generator(null, false);

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
         * @type {string[]}
         *
         * @private
         */
        this._compilerIgnorelist = (process.env.JYMFONY_COMPILER_IGNORE || '')
            .split(',')
            .map(v => __jymfony.trim(v))
            .filter(v => '' !== v)
            .map(v => v.startsWith('.') ? path.resolve(process.cwd(), v) : v)
        ;

        if (undefined === Compiler) {
            ClassLoader.compiler = require('@jymfony/compiler');
        }
    }

    /**
     * @internal
     */
    static get compiler() {
        if (undefined === Compiler) {
            ClassLoader.compiler = require('@jymfony/compiler');
        }

        return {
            Compiler,
            Parser,
            AST,
        };
    }

    /**
     * Sets the compiler class components.
     */
    static set compiler({ Compiler: compilerClass, Parser: parserClass, AST: astBase }) {
        Compiler = compilerClass;
        Parser = parserClass;
        AST = astBase;
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
     * @param {*} self
     * @param {string} namespace
     *
     * @returns {*}
     */
    loadClass(fn, self, namespace) {
        const exports = this.loadFile(fn, self, {}, namespace);

        return exports.__esModule ? exports.default : exports;
    }

    /**
     * Loads a file and returns the file exports.
     *
     * @param {string} fn
     * @param {*} self
     * @param {*} [exports]
     * @param {string} [namespace]
     *
     * @returns {*}
     */
    loadFile(fn, self, exports = {}, namespace = undefined) {
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

        return _cache[fn] = this._doLoadFile(fn, self, exports, namespace);
    }

    /**
     * Gets a file code.
     *
     * @param {string} fn
     * @param {boolean} [self]
     * @param {string} [namespace]
     *
     * @returns {{code: string, program: Program}}
     */
    getCode(fn, self = true, namespace = '') {
        if (codeCache[fn]) {
            return codeCache[fn];
        }

        let code, sourceMap, program = null;
        if (fn.endsWith('.ts')) {
            const module = this._doLoadTypescript(fn);
            code = module.outputText || '';
            try {
                sourceMap = JSON.parse(module.sourceMapText);
            } catch (e) {
                // @ignoreException
            }
        } else {
            code = stripBOM(this._finder.load(fn));
        }

        const decorators = {};

        const parser = new Parser();
        sourceMapGenerator.reset(fn, ! __jymfony.autoload.debug);
        const compiler = new Compiler(sourceMapGenerator, {filename: fn, namespace});

        try {
            program = parser.parse(code);
        } catch (e) {
            if (e instanceof SyntaxError) {
                e.message = 'Syntax error while parsing ' + fn + ': ' + e.message;
            }

            throw e;
        }

        program.prepare();

        const p = new AST.Program(program.location);

        if (sourceMap) {
            sourceMap.sources = sourceMap.sources.map(s => normalize(pathResolve(sourceMap.sourceRoot + '/' + s)));
            p.addSourceMappings(sourceMap);
        } else {
            p.addSourceMappings(...(program.sourceMappings.filter(isObjectLiteral)));
        }

        const args = [
            new AST.Identifier(null, 'exports'),
            new AST.Identifier(null, 'require'),
            new AST.Identifier(null, 'module'),
            new AST.Identifier(null, '__filename'),
            new AST.Identifier(null, '__dirname'),
        ];

        if (self) {
            args.push(new AST.Identifier(null, '__self'));
        }

        p.add(new AST.ParenthesizedExpression(null,
            new AST.FunctionExpression(null, new AST.BlockStatement(null, [
                new AST.StringLiteral(null, '\'use strict\''),
                ...program.body,
            ]), null, args)
        ));

        code = compiler.compile(p);
        registerSourceMap(fn, sourceMapGenerator);

        return codeCache[fn] = {
            code,
            program,
            decorators,
        };
    }

    /**
     * Loads and transpile typescript file.
     *
     * @param {string} fn The filename to load.
     *
     * @private
     */
    _doLoadTypescript(fn) {
        const code = this._finder.load(fn);

        return Typescript.transpileModule(code, {
            compilerOptions: { ...TypescriptConfig, sourceRoot: dirname(fn) },
            fileName: fn,
            moduleName: fn,
        });
    }

    /**
     * Internal file loader.
     *
     * @param {string} fn
     * @param {*} self
     * @param {*} exports
     * @param {string} namespace
     *
     * @returns {*}
     *
     * @private
     */
    _doLoadFile(fn, self, exports, namespace) {
        const module = this._getModuleObject(fn, exports);
        const dirname = module.paths[0];
        const opts = isNyc ? fn : {
            filename: fn,
            produceCachedData: false,
        };

        const req = id => {
            if (id.startsWith('node:') || builtinLibs.includes(id) || this._compilerIgnorelist.includes(id)) {
                return builtinRequire(id);
            }

            if (id.startsWith('.')) {
                id = this._path.resolve(dirname, id);
            }

            id = resolve(id, { paths: [ dirname ] });
            if (! id.endsWith('.js') && ! id.endsWith('.ts') && ! id.endsWith('.mjs')) {
                return require(id);
            }

            return this.loadFile(id, null);
        };

        req.extensions = require.extensions;
        req.nocompile = id => require(id);
        req.cache = require.cache;

        _cache[fn] = new __jymfony.ManagedProxy(function () { }, proxy => {
            if (! require.cache[fn]) {
                throw new CircularDependencyException(fn);
            }

            proxy.target = require.cache[fn].exports;
            return null;
        });

        req.proxy = id => {
            if (builtinLibs.includes(id)) {
                return builtinRequire(id);
            }

            id = resolve(id, { paths: [ dirname ] });
            if (_cache[id]) {
                return _cache[id];
            }

            const code = this.getCode(id, !!self, namespace);
            const exports = function () {};

            return _cache[id] = new ManagedProxy(exports, proxy => {
                proxy.initializer = null;
                proxy.target = exports;

                const module = this._getModuleObject(id, exports);
                const dirname = module.paths[0];

                this._vm.runInThisContext(code.code, opts)(module.exports, req, module, id, dirname, null);
                _cache[id] = proxy.target = module.exports;

                return null;
            });
        };

        req.optional = (id, asObject = false) => {
            try {
                return req(id);
            } catch (e) {
                return asObject ? {} : undefined;
            }
        };

        req.resolve = (id, options = {}) => {
            return resolve(id, { paths: [ dirname ], ...options });
        };

        let _pending;
        const code = this.getCode(fn, !!self, namespace);
        try {
            this._vm.runInThisContext(code.code, opts)(module.exports, req, module, fn, dirname, self);
        } catch (e) {
            if (e instanceof CircularDependencyException) {
                if (e.requiring === undefined) {
                    e.requiring = fn;
                }

                if (e.required === fn) {
                    delete _cache[e.requiring];
                    _pending = _cache[e.requiring] = req.proxy(e.requiring);

                    require.cache[fn] = module;
                    this._vm.runInThisContext(this.getCode(fn, !!self, namespace).code, opts)(module.exports, req, module, fn, dirname, self);

                    return _cache[fn] = module.exports;
                }
            }

            delete _cache[fn];
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
