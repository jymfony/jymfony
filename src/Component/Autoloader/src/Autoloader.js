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
        this._rootDir = this._finder.findRoot();

        /**
         * @type {Jymfony.Component.Autoloader.ClassLoader}
         *
         * @private
         */
        this._classLoader = undefined;

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
     * Gets the root dir.
     *
     * @returns {string}
     */
    get rootDir() {
        return this._rootDir;
    }

    /**
     * Gets the current class loader.
     *
     * @returns {Jymfony.Component.Autoloader.ClassLoader}
     */
    get classLoader() {
        return this._classLoader;
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
        this._debug = !! process.env.DEBUG;
        const autoloader = this;

        let ManagedProxy = null;

        const constructor = function (...$args) {
            if (undefined !== this[Symbol.__jymfony_field_initialization]) {
                this[Symbol.__jymfony_field_initialization]();
            }

            const retVal = this.__construct(...$args);
            if (undefined !== global.mixins && undefined !== this[global.mixins.initializerSymbol]) {
                this[global.mixins.initializerSymbol](...$args);
            }

            if (undefined !== retVal && this !== retVal) {
                return retVal;
            }

            let self = this;
            if (!! autoloader.debug) {
                self = new Proxy(self, {
                    get: (target, p) => {
                        if (p !== Symbol.toStringTag && ! Reflect.has(target, p)) {
                            throw new TypeError('Undefined property ' + p.toString() + ' on instance of ' + ReflectionClass.getClassName(target));
                        }

                        return Reflect.get(target, p);
                    },
                });
            }

            if (undefined !== this.__invoke) {
                return new ManagedProxy(self.__invoke, proxy => {
                    proxy.target = self;
                    return null;
                }, {
                    get: (target, key) => {
                        if ('__self__' === key) {
                            return target;
                        }

                        return Reflect.get(target, key);
                    },
                    apply: (target, ctx, args) => {
                        return target.__invoke(...args);
                    },
                    preventExtensions: (target) => {
                        Reflect.preventExtensions(target);

                        return false;
                    },
                    getOwnPropertyDescriptor: (target, key) => {
                        if ('__self__' === key) {
                            return { configurable: true, enumerable: false };
                        }

                        return Reflect.getOwnPropertyDescriptor(target, key);
                    },
                });
            }

            return this;
        };

        /**
         * This is the base class of all the autoloaded classes.
         * It is runtime-injected where needed.
         */
        this._global.__jymfony.JObject = class JObject {
            constructor(...$args) {
                return constructor.bind(this)(...$args);
            }

            __construct() { }
        };

        this._global.Symbol.reflection = Symbol('reflection');
        this._global.Symbol.docblock = Symbol('docblock');
        this._global.Symbol.__jymfony_field_initialization = Symbol('[FieldInitialization]');

        const ClassLoader = require('./ClassLoader');
        this._classLoader = new ClassLoader(this._finder, path, require('vm'));

        ManagedProxy = require('./Proxy/ManagedProxy');

        const includes = new Set();
        for (const module of this._finder.listModules()) {
            let packageInfo;
            const packageJson = path.join(this._rootDir, 'node_modules', module, 'package.json');

            try {
                packageInfo = JSON.parse(fs.readFileSync(packageJson, { encoding: 'utf8' }));
            } catch (e) {
                continue;
            }

            const dir = path.join(this._rootDir, 'node_modules', module);
            this._processPackageInfo(packageInfo, dir, includes);
        }

        this._processPackageInfo(
            JSON.parse(fs.readFileSync(this._rootDir + '/package.json', { encoding: 'utf8' })),
            this._rootDir,
            includes,
            true
        );

        for (const file of includes) {
            this._classLoader.loadFile(file, null);
        }
    }

    /**
     * @param {Object} packageInfo
     * @param {string} baseDir
     * @param {Set<string>} includes
     * @param {boolean} [root = false]
     *
     * @private
     */
    _processPackageInfo(packageInfo, baseDir, includes, root = false) {
        if (! packageInfo.config || ! packageInfo.config['jymfony-autoload']) {
            return;
        }

        const config = packageInfo.config['jymfony-autoload'];
        if (config.namespaces) {
            this._processNamespaces(config.namespaces, baseDir);
        }

        if (config.includes) {
            this._processIncludes(config.includes, baseDir, includes);
        }

        if (root) {
            const configDev = packageInfo.config['jymfony-autoload-dev'] || {};
            if (configDev.namespaces) {
                this._processNamespaces(configDev.namespaces, baseDir);
            }

            if (configDev.includes) {
                this._processIncludes(configDev.includes, baseDir, includes);
            }
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
            if (! parent.hasOwnProperty(last)) {
                parent[last] = new Namespace(this, this._generateFqn(parent, last), nsDirectory);
            } else {
                parent[last].__namespace.addDirectory(nsDirectory);
            }
        }
    }

    /**
     * @param {Object} config
     * @param {string} baseDir
     * @param {Set<string>} includes
     *
     * @private
     */
    _processIncludes(config, baseDir, includes) {
        for (const fileName of config) {
            includes.add(baseDir + '/' + fileName);
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
        if (! Object.prototype.hasOwnProperty.call(parent, namespace)) {
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
