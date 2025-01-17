const ManagedProxy = require('./Proxy/ManagedProxy');

let ClassNotFoundException = undefined;
const FunctionPrototype = new Function();

/**
 * @memberOf Jymfony.Component.Autoloader
 */
class Namespace {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Autoloader} autoloader
     * @param {string} fqn
     * @param {string[]|string} baseDirs
     * @param {Function} req
     *
     * @returns {Proxy} The namespace object
     */
    constructor(autoloader, fqn, baseDirs = [], req = require) {
        /**
         * @type {Jymfony.Component.Autoloader.Autoloader}
         *
         * @private
         */
        this._autoloader = autoloader;

        /**
         * @type {require|Function}
         * @private
         */
        this._internalRequire = req;

        this._fullyQualifiedName = fqn;
        if (undefined === ClassNotFoundException) {
            ClassNotFoundException = this._internalRequire('./Exception/ClassNotFoundException.js');
        }

        this._target = {
            __namespace: this,
        };

        this._baseDirs = new Set();
        if ('string' === typeof baseDirs) {
            baseDirs = [ baseDirs ];
        }

        for (const dir of baseDirs) {
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
     * @param {string} directory
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
     * Gets the namespace base directories.
     *
     * @returns {string[]}
     */
    get directories() {
        return [ ...this._baseDirs ];
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

        if ('__construct' === name) {
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
     *
     * @returns {*}
     *
     * @private
     */
    _find(name) {
        let stat;
        const finder = this._autoloader.finder;
        for (const dir of this._baseDirs) {
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

    /**
     * @param {string} filename
     *
     * @returns {Function}
     *
     * @private
     */
    _require(filename) {
        const fn = this._internalRequire.resolve(filename);

        const init = proxy => {
            let mod;
            proxy.initializer = null;

            try {
                if (fn !== __filename) {
                    mod = this._autoloader.classLoader.loadClass(fn, this._fullyQualifiedName);
                } else {
                    mod = this._internalRequire(fn);
                }

                // Class constructor
                if ('function' !== typeof mod) {
                    throw new ClassNotFoundException(`Class not found in ${fn}. The file was found, but the class isn't there.`);
                }
            } catch (e) {
                proxy.initializer = init;
                throw e;
            }

            if (! mod.hasOwnProperty('arguments')) {
                Object.defineProperty(mod, 'arguments', {value: null, writable: false, enumerable: false, configurable: false});
            }

            if (! mod.hasOwnProperty('caller')) {
                Object.defineProperty(mod, 'caller', {value: null, writable: false, enumerable: false, configurable: false});
            }

            proxy.target = mod;
            return null;
        };

        return new ManagedProxy(FunctionPrototype, init, {
            get: (target, key) => {
                if ('toString' === key && target[key] === FunctionPrototype.toString) {
                    return FunctionPrototype.toString.bind(target);
                }

                if ('valueOf' === key && target[key] === FunctionPrototype.valueOf) {
                    return FunctionPrototype.valueOf.bind(target);
                }

                if (Symbol.for('jymfony.namespace.class') === key) {
                    return target;
                }

                return Reflect.get(target, key);
            },
            has: (target, key) => {
                if (Symbol.for('jymfony.namespace.class') === key) {
                    return true;
                }

                return Reflect.has(target, key);
            },
            ownKeys: (target) => {
                return Reflect.ownKeys(target).filter(k => k !== Symbol.reflection);
            },
            getOwnPropertyDescriptor: (target, key) => {
                if (Symbol.for('jymfony.namespace.class') === key) {
                    return {
                        configurable: true,
                        enumerable: false,
                        value: target,
                    };
                }

                return Reflect.getOwnPropertyDescriptor(target, key);
            },
        });
    }
}

module.exports = Namespace;
