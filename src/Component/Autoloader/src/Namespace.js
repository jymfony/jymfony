let ClassNotFoundException = undefined;

/**
 * @memberOf Jymfony.Component.Autoloader
 * @type Namespace
 */
module.exports = class Namespace {
    /**
     * Namespace constructor
     *
     * @param {Jymfony.Component.Autoloader.Autoloader} autoloader
     * @param {string} fqn
     * @param {string[]|string} baseDirs
     * @param {Function} req
     *
     * @returns {Proxy} The namespace object
     */
    constructor(autoloader, fqn, baseDirs = [], req = require) {
        this._autoloader = autoloader;
        this._internalRequire = req;
        this._fullyQualifiedName = fqn;
        if (undefined === ClassNotFoundException) {
            ClassNotFoundException = this._require('./Exception/ClassNotFoundException.js');
        }

        this._target = {
            __namespace: this,
        };

        this._baseDirs = new Set;
        if ('string' === typeof baseDirs) {
            baseDirs = [ baseDirs ];
        }

        for (let dir of baseDirs) {
            this.addDirectory(dir);
        }

        return new Proxy(this._target, {
            get: (target, name) => {
                return this._get(target, name);
            },
        });
    }

    /**
     * Add a base directory to search classes in
     *
     * @param directory
     *
     * @returns {Jymfony.Component.Autoloader.Namespace}
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
        if ('string' !== typeof name) {
            return undefined;
        }

        if (undefined === target[name]) {
            let found;
            try {
                found = this._find(name);
            } catch (e) {
                if (! (e instanceof ClassNotFoundException) || this._autoloader.debug) {
                    throw e;
                }

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
        let finder = this._autoloader.finder;
        for (let dir of this._baseDirs) {
            stat = finder.find(dir, name);
            if (stat !== undefined) {
                break;
            }
        }

        if (! stat) {
            throw new ClassNotFoundException(`Cannot resolve "${this.name}.${name}". File or directory cannot be found`);
        }

        if (stat.directory) {
            return new Namespace(this._autoloader, this.name + '.' + name, stat.filename);
        }

        return this._require(stat.filename);
    }

    _require(filename) {
        let fn = this._internalRequire.resolve(filename);
        let mod = this._internalRequire(fn);

        // Class constructor
        if ('function' !== typeof mod) {
            throw new ClassNotFoundException(`Class not found in ${fn}. The file was found, but the class isn't there.`);
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
                namespace: this,
            },
        });

        if (mod.definition) {
            // Interface or Trait

            Object.defineProperty(mod.definition, '__reflection', {
                enumerable: false,
                writable: false,
                configurable: false,
                value: {
                    filename: fn,
                    fqcn: this._fullyQualifiedName + '.' + mod.definition.name,
                    module: this._internalRequire.cache[fn],
                    constructor: mod.definition,
                    namespace: this,
                },
            });
        }

        return new Proxy(mod, {
            construct: (target, argumentsList, newTarget) => {
                let obj = Reflect.construct(target, argumentsList, newTarget);

                if (target.prototype === newTarget.prototype && 'function' === typeof obj.__construct) {
                    obj.__construct(...argumentsList);
                }

                return obj;
            },
        });
    }
};
