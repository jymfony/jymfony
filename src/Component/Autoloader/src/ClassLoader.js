const Patcher = require('./Parser/Patcher');
const isNyc = !! global.__coverage__;

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
     * @param {Finder} finder
     * @param {path} path
     * @param {vm} vm
     */
    constructor(finder, path, vm) {
        /**
         * @type {Finder}
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

        try {
            const parser = new Patcher(code);
            code = parser.code;
        } catch (err) {
            // Patcher have failed. Code is unpatched, but can be included.

            if (! (err instanceof SyntaxError)) {
                throw err;
            }
        }

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

        code = `(function(exports, require, module, __filename, __dirname, __self) { 'use strict'; ${code} });`;

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
