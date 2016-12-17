let ClassNotFoundException = undefined;

/**
 * @memberOf Jymfony.Autoloader
 * @type {Jymfony.Autoloader.Namespace}
 */
module.exports = class Namespace {
    /**
     * Namespace constructor
     *
     * @param {Finder} finder
     * @param {string} fqn
     * @param {Array<string>, string} baseDirs
     * @param {Function} req
     *
     * @returns {Proxy} The namespace object
     */
    constructor(finder, fqn, baseDirs = [], req = require) {
        this._finder = finder;
        this._internalRequire = req;
        this._fullyQualifiedName = fqn;
        if (undefined === ClassNotFoundException) {
            ClassNotFoundException = this._require('./Exception/ClassNotFoundException.js');
        }

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
     * @returns {Jymfony.Autoloader.Namespace}
     */
    addDirectory(directory) {
        this._baseDirs.add(directory);
        return this;
    }

    /**
     * Get the namespace FQN
     *
     * @returns {string}
     */
    get name() {
        return this._fullyQualifiedName;
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
            target[name] = this._find(name);
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
            return new Namespace(this._finder, this.name + '.' + name, stat.filename);
        }

        return this._require(stat.filename);
    }

    _require(filename) {
        let fn = this._internalRequire.resolve(filename);
        let mod = this._internalRequire(fn);

        // class constructor
        if (typeof mod !== 'function') {
            throw new ClassNotFoundException('Class not found in ' + fn + '. The file was found, but the class isn\'t there.');
        }

        Object.defineProperty(mod, '__reflection', {
            enumerable: false,
            writable: false,
            configurable: false,
            value: {
                filename: fn,
                fqcn: this._fullyQualifiedName + '.' + mod.name,
                module: this._internalRequire.cache[fn],
                constructor: mod,
                namespace: this
            }
        });

        return mod;
    }
};
