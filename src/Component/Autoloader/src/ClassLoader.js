try {
    require('@jymfony/util');
} catch (e) {
    require('../../../util');
}

let Compiler;
let Parser;
let AST;
const isNyc = !! global.__coverage__;

const Generator = require('./Parser/SourceMap/Generator');
const StackHandler = require('./Parser/SourceMap/StackHandler');
const Storage = function () {};
Storage.prototype = {};

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

        let code = this._finder.load(fn);
        const sourceMapGenerator = new Generator({ file: fn });

        try {
            const parser = new Parser();
            const compiler = new Compiler(sourceMapGenerator);

            const program = parser.parse(code);
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

        this._vm.runInThisContext(code, opts)(moduleObj.exports, (id) => {
            if (id.startsWith('./') || id.startsWith('../')) {
                return require(this._path.resolve(dirname, id));
            }

            return require(id);
        }, moduleObj, fn, dirname, self);

        return this._cache[fn] = moduleObj.exports;
    }
}

module.exports = ClassLoader;
