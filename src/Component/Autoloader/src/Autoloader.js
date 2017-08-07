const Finder = require('./Finder');
const Namespace = require('./Namespace');
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
     * @param {undefined|Jymfony.Component.Autoloader.Finder} finder
     * @param {Object} globalObject
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
         * @private
         */
        this._debug = false;

        /**
         * @type {boolean}
         * @private
         */
        this._registered = false;

        /**
         * @type {Jymfony.Component.Autoloader.Finder}
         * @private
         */
        this._finder = finder;

        /**
         * @type {Object}
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
        Symbol.reflection = Symbol('reflection');

        let rootDir = this._finder.findRoot();
        for (let module of this._finder.listModules()) {
            let packageInfo;
            let packageJson = path.join(rootDir, 'node_modules', module, 'package.json');

            try {
                packageInfo = require(packageJson);
            } catch (e) {
                continue;
            }

            let dir = path.join(rootDir, 'node_modules', module);
            this._processPackageInfo(packageInfo, dir);
        }

        this._processPackageInfo(require(rootDir + '/package.json'), rootDir);
    }

    _processPackageInfo(packageInfo, baseDir) {
        if (! packageInfo.config || ! packageInfo.config['jymfony-autoload']) {
            return;
        }

        let config = packageInfo.config['jymfony-autoload'];
        if (config.namespaces) {
            this._processNamespaces(config.namespaces, baseDir);
        }

        if (config.includes) {
            this._processIncludes(config.includes, baseDir);
        }
    }

    _processNamespaces(config, baseDir) {
        for (let namespace in config) {
            if (! config.hasOwnProperty(namespace)) {
                continue;
            }

            let parts = namespace.split('.');
            let last = parts.pop();
            let parent = this._global;

            for (let part of parts) {
                parent = this._ensureNamespace(part, parent);
            }

            let nsDirectory = path.normalize(baseDir + '/' + config[namespace]);
            if (undefined === parent[last]) {
                parent[last] = new Namespace(this, this._generateFqn(parent, last), nsDirectory);
            } else {
                parent[last].__namespace.addDirectory(nsDirectory);
            }
        }
    }

    _processIncludes(config, baseDir) {
        for (let fileName of config) {
            require(baseDir + '/' + fileName);
        }
    }

    _ensureNamespace(namespace, parent) {
        if (parent[namespace] === undefined) {
            return parent[namespace] = new Namespace(this, this._generateFqn(parent, namespace));
        }

        return parent[namespace];
    }

    _generateFqn(parent, namespace) {
        return (parent === this._global ? '' : parent.__namespace.name + '.') + namespace;
    }
}

module.exports = Autoloader;
