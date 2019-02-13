const Finder = require('./Finder');
const Namespace = require('./Namespace');
const fs = require('fs');
const path = require('path');

/**
 * Main autoloader.
 * Singleton class: the constructor returns always the
 * same instance (in the same global context)
 *
 * @memberOf Jymfony.Component.Autoloader
 */
class Autoloader {
    /**
     * Constructor.
     *
     * @param {undefined|Jymfony.Component.Autoloader.Finder} [finder]
     * @param {Object} [globalObject = global]
     */
    constructor(finder = undefined, globalObject = global) {
        if (globalObject.__jymfony && globalObject.__jymfony.autoload) {
            return globalObject.__jymfony.autoload;
        }

        if (! finder) {
            finder = new Finder();
        }

        /**
         * @type {boolean}
         *
         * @private
         */
        this._debug = false;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._registered = false;

        /**
         * @type {Jymfony.Component.Autoloader.Finder}
         *
         * @private
         */
        this._finder = finder;

        /**
         * @type {Object}
         *
         * @private
         */
        this._global = globalObject;
        this._global.__jymfony = this._global.__jymfony || {};

        /**
         * @type {Jymfony.Component.Autoloader.Autoloader}
         */
        this._global.__jymfony.autoload = this;
    }

    /**
     * Get debug flag.
     *
     * @returns {boolean}
     */
    get debug() {
        return this._debug;
    }

    /**
     * Set debug flag.
     * If true, the autoloader will throw ClassNotFoundException if
     * the class (or a namespace) does not exist.
     *
     * @param {boolean} value
     */
    set debug(value) {
        this._debug = !! value;
    }

    /**
     * Gets the current finder.
     *
     * @returns {Jymfony.Component.Autoloader.Finder}
     */
    get finder() {
        return this._finder;
    }

    /**
     * Scans package.json of the project and root dependencies
     * and register itself as autoloader for found namespaces
     */
    register() {
        if (this._registered) {
            return;
        }

        this._registered = true;
        const autoloader = this;

        /**
         * This is the base class of all the autoloaded classes.
         * It is runtime-injected where needed.
         */
        this._global.__jymfony.JObject = class JObject {
            constructor(...$args) {
                const retVal = this.__construct(...$args);
                if (undefined !== global.mixins && undefined !== this[global.mixins.initializerSymbol]) {
                    this[global.mixins.initializerSymbol]();
                }

                if (undefined !== retVal && this !== retVal) {
                    return retVal;
                }

                let self = this;
                if (!! autoloader.debug) {
                    Reflect.preventExtensions(this);

                    self = new Proxy(self, {
                        get: (target, p) => {
                            if (p !== Symbol.toStringTag && ! Reflect.has(target, p)) {
                                throw new TypeError('Undefined property ' + p.toString());
                            }

                            return Reflect.get(target, p);
                        },
                    });
                }

                if (undefined !== this.__invoke) {
                    return new Proxy(self.__invoke, {
                        get: (target, key) => {
                            return Reflect.get(self, key);
                        },
                        set: (target, key, value) => {
                            return Reflect.set(self, key, value);
                        },
                        has: (target, key) => {
                            return Reflect.has(self, key);
                        },
                        deleteProperty: (target, key) => {
                            return Reflect.deleteProperty(self, key);
                        },
                        defineProperty: (target, key, descriptor) => {
                            return Reflect.defineProperty(self, key, descriptor);
                        },
                        enumerate: () => {
                            return Reflect.enumerate(self);
                        },
                        ownKeys: () => {
                            return Reflect.ownKeys(self);
                        },
                        apply: (target, ctx, args) => {
                            return self.__invoke(...args);
                        },
                        construct: (target, argumentsList, newTarget) => {
                            return Reflect.construct(self, argumentsList, newTarget);
                        },
                        getPrototypeOf: () => {
                            return Reflect.getPrototypeOf(self);
                        },
                        setPrototypeOf: (target, proto) => {
                            return Reflect.setPrototypeOf(self, proto);
                        },
                        isExtensible: () => {
                            return Reflect.isExtensible(self);
                        },
                        preventExtensions: () => {
                            return Reflect.preventExtensions(self);
                        },
                        getOwnPropertyDescriptor: (target, key) => {
                            return Reflect.getOwnPropertyDescriptor(self, key);
                        },
                    });
                }
            }

            __construct() { }
        };

        this._global.Symbol.reflection = Symbol('reflection');
        this._global.Symbol.docblock = Symbol('docblock');

        const rootDir = this._finder.findRoot();
        for (const module of this._finder.listModules()) {
            let packageInfo;
            const packageJson = path.join(rootDir, 'node_modules', module, 'package.json');

            try {
                packageInfo = JSON.parse(fs.readFileSync(packageJson, { encoding: 'utf8' }));
            } catch (e) {
                continue;
            }

            const dir = path.join(rootDir, 'node_modules', module);
            this._processPackageInfo(packageInfo, dir);
        }

        this._processPackageInfo(JSON.parse(fs.readFileSync(rootDir + '/package.json', { encoding: 'utf8' })), rootDir);
    }

    /**
     * @param {Object} packageInfo
     * @param {string} baseDir
     *
     * @private
     */
    _processPackageInfo(packageInfo, baseDir) {
        if (! packageInfo.config || ! packageInfo.config['jymfony-autoload']) {
            return;
        }

        const config = packageInfo.config['jymfony-autoload'];
        if (config.namespaces) {
            this._processNamespaces(config.namespaces, baseDir);
        }

        if (config.includes) {
            this._processIncludes(config.includes, baseDir);
        }
    }

    /**
     * @param {Object} config
     * @param {string} baseDir
     *
     * @private
     */
    _processNamespaces(config, baseDir) {
        for (const namespace in config) {
            if (! config.hasOwnProperty(namespace)) {
                continue;
            }

            const parts = namespace.split('.');
            const last = parts.pop();
            let parent = this._global;

            for (const part of parts) {
                parent = this._ensureNamespace(part, parent);
            }

            const nsDirectory = path.normalize(baseDir + '/' + config[namespace]);
            if (undefined === parent[last]) {
                parent[last] = new Namespace(this, this._generateFqn(parent, last), nsDirectory);
            } else {
                parent[last].__namespace.addDirectory(nsDirectory);
            }
        }
    }

    /**
     * @param {Object} config
     * @param {string} baseDir
     *
     * @private
     */
    _processIncludes(config, baseDir) {
        for (const fileName of config) {
            require(baseDir + '/' + fileName);
        }
    }

    /**
     * @param {Object} namespace
     * @param {Object} parent
     *
     * @returns {Object}
     *
     * @private
     */
    _ensureNamespace(namespace, parent) {
        if (parent[namespace] === undefined) {
            return parent[namespace] = new Namespace(this, this._generateFqn(parent, namespace));
        }

        return parent[namespace];
    }

    /**
     * @param {Object} parent
     * @param {Object} namespace
     *
     * @returns {string}
     *
     * @private
     */
    _generateFqn(parent, namespace) {
        return (parent === this._global ? '' : parent.__namespace.name + '.') + namespace;
    }
}

module.exports = Autoloader;
