const ClassLoader = require('./ClassLoader');

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

        this._classLoader = new ClassLoader(autoloader.finder, this._internalRequire('path'), this._internalRequire('vm'));

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
        let realTarget = undefined, self = undefined;

        const init = () => {
            if (undefined !== realTarget) {
                return;
            }

            let mod;
            if (fn !== __filename) {
                mod = this._classLoader.load(fn, self);
            } else {
                mod = this._internalRequire(fn);
            }

            // Class constructor
            if ('function' !== typeof mod) {
                throw new ClassNotFoundException(`Class not found in ${fn}. The file was found, but the class isn't there.`);
            }

            realTarget = mod;

            const name = mod.definition ? mod.definition.name : mod.name;
            const meta = {
                filename: fn,
                fqcn: this._fullyQualifiedName + '.' + name,
                module: this._internalRequire.cache[fn],
                constructor: mod,
                namespace: this,
                isModule: (val) => {
                    return self === val || mod === val || mod.definition === val;
                },
            };

            if (! mod.hasOwnProperty('arguments')) {
                Object.defineProperty(mod, 'arguments', {value: null, writable: false, enumerable: false, configurable: false});
            }

            if (! mod.hasOwnProperty('caller')) {
                Object.defineProperty(mod, 'caller', {value: null, writable: false, enumerable: false, configurable: false});
            }

            Object.defineProperty(mod, Symbol.reflection, {
                enumerable: false,
                writable: false,
                configurable: false,
                value: meta,
            });

            if (mod.definition) {
                // Interface or Trait
                Object.defineProperty(mod.definition, Symbol.reflection, {
                    enumerable: false,
                    writable: false,
                    configurable: false,
                    value: meta,
                });
            }
        };

        const handlers = {
            get: (target, key) => {
                init();
                return Reflect.get(realTarget, key);
            },
            set: (target, key, value) => {
                init();
                return Reflect.set(realTarget, key, value);
            },
            has: (target, key) => {
                init();
                return Reflect.has(realTarget, key);
            },
            deleteProperty: (target, key) => {
                init();
                return Reflect.deleteProperty(realTarget, key);
            },
            defineProperty: (target, key, descriptor) => {
                init();
                return Reflect.defineProperty(realTarget, key, descriptor);
            },
            enumerate: () => {
                init();
                return Reflect.enumerate(realTarget);
            },
            ownKeys: () => {
                init();
                return Reflect.ownKeys(realTarget);
            },
            apply: (target, thisArgument, args) => {
                init();
                return Reflect.apply(realTarget, thisArgument, args);
            },
            construct: (target, argumentsList, newTarget) => {
                init();
                return Reflect.construct(realTarget, argumentsList, newTarget);
            },
            getPrototypeOf: () => {
                init();
                return Reflect.getPrototypeOf(realTarget);
            },
            setPrototypeOf: (target, proto) => {
                init();
                return Reflect.setPrototypeOf(realTarget, proto);
            },
            isExtensible: () => {
                init();
                return Reflect.isExtensible(realTarget);
            },
            preventExtensions: () => {
                init();
                return Reflect.preventExtensions(realTarget);
            },
            getOwnPropertyDescriptor: (target, key) => {
                init();
                return Reflect.getOwnPropertyDescriptor(realTarget, key);
            },
        };

        return self = new Proxy(FunctionPrototype, handlers);
    }
}

module.exports = Namespace;
