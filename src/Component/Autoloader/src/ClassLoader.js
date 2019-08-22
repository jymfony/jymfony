try {
    require('@jymfony/util');
} catch (e) {
    require('../../../util');
}

let Compiler;
let Parser;
let AST;

const ManagedProxy = require('./Proxy/ManagedProxy');
const isNyc = !! global.__coverage__;

const Generator = require('./Parser/SourceMap/Generator');
const StackHandler = require('./Parser/SourceMap/StackHandler');
const Storage = function () {};
Storage.prototype = {};

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
         * @type {Object}
         *
         * @private
         */
        this._cache = new Storage();

        if (undefined === Compiler) {
            Compiler = require('./Parser/Compiler');
            Parser = require('./Parser/Parser');
            AST = require('./Parser/AST');
        }
    }

    /**
     * @param {string} fn
     * @param {*} self
     *
     * @returns {*}
     */
    load(fn, self) {
        if (this._cache[fn]) {
            return this._cache[fn];
        }

        const exports = this._doLoadFile(fn, self);

        return this._cache[fn] = exports.__esModule ? exports.default : exports;
    }

    _doLoadFile(fn, self) {
        let code = this._finder.load(fn);
        const sourceMapGenerator = new Generator({ file: fn });

        try {
            const parser = new Parser();
            const compiler = new Compiler(sourceMapGenerator);

            const program = parser.parse(code);
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
        } catch (err) {
            // Compiler have failed. Code is unpatched, but can be included.

            if (! (err instanceof SyntaxError)) {
                throw err;
            } else {
                console.warn('Syntax error while parsing ' + fn + ': ' + err.message);
            }
        }

        StackHandler.registerSourceMap(fn, sourceMapGenerator.toJSON().mappings);

        const dirname = this._path.dirname(fn);
        const moduleObj = {
            children: [],
            exports: {},
            filename: fn,
            id: fn,
            loaded: false,
            parent: module,
            paths: dirname,
            require: require,
        };

        const opts = isNyc ? fn : {
            filename: fn,
            produceCachedData: false,
        };

        const req = id => {
            if (id.startsWith('./') || id.startsWith('../')) {
                const resolved = this._path.resolve(dirname, id);
                const found = this._finder.find(this._path.dirname(resolved), this._path.basename(resolved));

                if (undefined === found || (! found.directory && '.js' !== this._path.extname(found.filename))) {
                    return require(resolved);
                } else if (found.directory) {
                    let fn = 'index.js';
                    try {
                        const packageJson = JSON.parse(this._finder.load(found.directory + this._path.sep + 'package.json'));
                        fn = packageJson.main || fn;
                    } catch (e) {
                        // Do nothing
                    }

                    return this._doLoadFile(found.directory + this._path.sep + fn, null);
                }

                return this._doLoadFile(found.filename, null);
            }

            return require(id);
        };

        req.proxy = id => {
            if (builtinLibs.includes(id)) {
                return require(id);
            }

            return new ManagedProxy({}, proxy => {
                proxy.target = req(id);

                return null;
            });
        };

        this._vm.runInThisContext(code, opts)(moduleObj.exports, req, moduleObj, fn, dirname, self);

        return moduleObj.exports;
    }
}

module.exports = ClassLoader;
