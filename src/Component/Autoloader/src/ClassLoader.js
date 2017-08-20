const Patcher = require('./Parser/Patcher');

let Storage = function () {};
Storage.prototype = {};

/**
 * Patching-replacement for "require" function in Autoloader component.
 *
 * @internal
 * @memberOf Jymfony.Component.Autoloader
 */
class ClassLoader {
    /**
     * @param {Finder} finder
     * @param {path} path
     * @param {vm} vm
     */
    constructor(finder, path, vm) {
        /**
         * @type {Finder}
         * @private
         */
        this._finder = finder;

        /**
         * @type {path}
         * @private
         */
        this._path = path;

        /**
         * @type {vm}
         * @private
         */
        this._vm = vm;

        /**
         * @type {Object}
         * @private
         */
        this._cache = new Storage();
    }

    load(fn, self) {
        if (this._cache[fn]) {
            return this._cache[fn];
        }

        let code = this._finder.load(fn);

        try {
            let parser = new Patcher(code);
            code = parser.code;
        } catch (err) {
            // Patcher have failed. Code is unpatched, but can be included.

            if (! (err instanceof SyntaxError)) {
                throw err;
            }
        }

        let dirname = this._path.dirname(fn);
        let moduleObj = {
            children: [],
            exports: undefined,
            filename: fn,
            id: fn,
            loaded: false,
            parent: module,
            paths: dirname,
            require: require,
        };

        code = `(function(exports, require, module, __filename, __dirname, __self) {
${code}
});`;

        let script = new this._vm.Script(code, {
            filename: fn,
            produceCachedData: false,
            lineOffset: -1,
        });

        script.runInThisContext({
            filename: fn,
        })(moduleObj.exports, (id) => {
            if (id.startsWith('./') || id.startsWith('../')) {
                return require(this._path.resolve(dirname, id));
            }

            return require(id);
        }, moduleObj, fn, dirname, self);

        return this._cache[fn] = moduleObj.exports;
    }
}

module.exports = ClassLoader;
