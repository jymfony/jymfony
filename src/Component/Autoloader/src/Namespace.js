module.exports = class Namespace {
    /**
     * Namespace constructor
     *
     * @param {Finder} finder
     * @param {Array<string>, string} baseDirs
     * @param {Function} require
     *
     * @returns {Proxy} The namespace object
     */
    constructor(finder, baseDirs = [], require = module.require) {
        this._finder = finder;
        this._require = require;
        this._target = {
            __namespace: this
        };
        this._baseDirs = new Set;
        if (typeof baseDirs === 'string') {
            baseDirs = [baseDirs];
        }

        for (let dir of baseDirs) {
            this.addDirectory(dir);
        }

        return new Proxy(this._target, {
            get: (target, name) => {
                return this._get(target, name);
            }
        });
    }

    /**
     * Add a base directory to search classes in
     *
     * @param directory
     *
     * @returns {Namespace}
     */
    addDirectory(directory) {
        this._baseDirs.add(directory);
        return this;
    }

    /**
     * Autoload/get a class or namespace
     *
     * @param {object} target
     * @param {string} name
     *
     * @returns {*}
     *
     * @private
     */
    _get(target, name) {
        if (typeof name === 'symbol') {
            return undefined;
        }

        if (true === target[name]) {
            return undefined;
        } else if (undefined === target[name]) {
            let found = this._find(name);
            if (typeof found !== 'function') {
                target[name] = true;
                return undefined;
            }

            target[name] = found;
        }

        return target[name];
    }

    /**
     * Searches in all registered base dirs for
     * class/namespace and returns it if found
     *
     * @param {string} name
     * @returns {*}
     *
     * @private
     */
    _find(name) {
        let stat;
        for (let dir of this._baseDirs) {
            stat = this._finder.find(dir, name);
            if (stat !== undefined) {
                break;
            }
        }

        if (! stat) {
            return undefined;
        }

        if (stat.directory) {
            return new Namespace(this._finder, stat.filename);
        }

        return this._require(stat.filename);
    }
};
