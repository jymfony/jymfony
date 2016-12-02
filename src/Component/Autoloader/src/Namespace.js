module.exports = class Namespace {
    /**
     * Namespace constructor
     *
     * @param {Finder} finder
     * @param {Array<string>, string} baseDirs
     *
     * @returns {Proxy} The namespace object
     */
    constructor(finder, baseDirs = []) {
        this._finder = finder;
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
            get: this._get
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
            let t = target.__namespace._find(name);
            if (typeof t !== 'function') {
                target[name] = true;
                return undefined;
            }

            target[name] = t;
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

        return require(stat.filename);
    }
};
