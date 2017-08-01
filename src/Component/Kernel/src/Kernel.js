const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ConfigCache = Jymfony.Component.Config.ConfigCache;

const fs = require('fs');
const path = require('path');

/**
 * @memberOf Jymfony.Component.Kernel
 */
class Kernel {
    /**
     * Constructor.
     *
     * @param {string} environment
     * @param {boolean} debug
     */
    __construct(environment, debug) {
        /**
         * @type {string}
         * @protected
         */
        this._environment = environment;

        /**
         * @type {boolean}
         * @protected
         */
        this._debug = debug;

        if (this._debug) {
            this._startTime = new Date();
        }

        /**
         * @type {Jymfony.Component.DependencyInjection.Container}
         * @protected
         */
        this._container = undefined;

        /**
         * @type {Jymfony.Component.Kernel.Bundle[]}
         * @protected
         */
        this._bundles = {};

        this._booted = false;
    }

    /**
     * Boots the kernel
     */
    boot() {
        if (this._booted) {
            return;
        }

        this._initializeBundles();
        this._initializeContainer();

        for (let bundle of Object.values(this._bundles)) {
            bundle.setContainer(this._container);
            bundle.boot();
        }

        this._booted = true;
    }

    /**
     * Get the application logs dir
     *
     * @returns {string}
     */
    getLogsDir() {
        return path.normalize(path.join(this.getRootDir(), '..', 'var', 'logs'));
    }

    /**
     * Get the application cache dir
     *
     * @returns {string}
     */
    getCacheDir() {
        return path.normalize(path.join(this.getRootDir(), '..', 'var', 'cache'));
    }

    /**
     * Get the application root dir
     *
     * @returns {string}
     */
    getRootDir() {
        if (undefined === this._rootDir) {
            let r = new ReflectionClass(this);
            this._rootDir = path.dirname(r.filename);
        }

        return this._rootDir;
    }

    /**
     * Gets the bundles to be registered
     *
     * @returns {Jymfony.Component.Kernel.Bundle[]}
     * @abstract
     */
    * registerBundles() {
        throw new Error('You must override registerBundles method');
    }

    _initializeBundles() {
        let directChildren = {};
        let topMostBundles = {};

        for (let bundle of this.registerBundles()) {
            let name = bundle.getName();
            if (this._bundles[name]) {
                throw new LogicException(`Trying to register two bundles with the same name "${name}"`);
            }
            
            this._bundles[name] = bundle;
            let parentName;
            if (parentName = bundle.getParent()) {
                if (directChildren[parentName]) {
                    throw new LogicException(`Bundle "${parentName}" is directly extended by two bundles "${name}" and "${directChildren[parentName]}".`);
                }

                if (parentName === name) {
                    throw new LogicException(`Bundle "${name}" can not extend itself.`);
                }

                directChildren[parentName] = name;
            } else {
                topMostBundles[name] = bundle;
            }
        }

        // Look for orphans
        let diff = __jymfony.diff_key(directChildren, this._bundles);
        if (directChildren.length && diff.length) {
            diff = Object.keys(diff);

            throw new LogicException(`Bundle "${directChildren[diff[0]]}" extends bundle "${diff[0]}", which is not registered.`);
        }

        // Inheritance
        /**
         * @type {Object}
         * @protected
         */
        this._bundleMap = {};
        for (let [ name, bundle ] of __jymfony.getEntries(topMostBundles)) {
            let bundleMap = [ bundle ];
            let hierarchy = [ name ];

            while (directChildren[name]) {
                name = directChildren[name];
                bundleMap.unshift(this._bundles[name]);
                hierarchy.push(name);
            }

            for (let hierarchyBundle of hierarchy) {
                this._bundleMap[hierarchyBundle] = bundleMap;
                bundleMap.pop();
            }
        }
    }

    /**
     * Initializes the service container.
     *
     * The cached version of the service container is used when fresh, otherwise a
     * new container is built.
     *
     * @protected
     */
    _initializeContainer() {
        let container;
        let class_ = this._getContainerClass();
        let cache = new ConfigCache(this.getCacheDir() + '/' + class_ + '.js', this._debug);

        let fresh = cache.isFresh();
        if (! fresh) {
            container = this._buildContainer();
            container.compile();

            this._dumpContainer(container, cache);
        }

        container = new (require(cache.getPath()))();

        this._container = container;
        this._container.set('kernel', this);

        if (! fresh && this._container.has('cache_warmer')) {
            this._container.get('cache_warmer').warmUp(this._container.getParameter('kernel.cache_dir'));
        }
    }

    /**
     * Dumps the container in JS code in cache
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.ConfigCache} cache
     *
     * @protected
     */
    _dumpContainer(container, cache) {
        let dumper = new Jymfony.Component.DependencyInjection.Dumper.JsDumper(container);
        let options = {
            class_name: this._getContainerClass(),
            debug: this._debug,
        };

        cache.write(dumper.dump(options), container.getResources());
    }

    /**
     * Builds the service container
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     * @protected
     */
    _buildContainer() {
        let createDir = (name, dir) => {
            let mkdirRec = dir => {
                for (let i = 2; 0 < i; i--) {
                    try {
                        fs.mkdirSync(dir, 0o777);
                        break;
                    } catch (e) {
                        if ('ENOENT' !== e.code) {
                            throw e;
                        }

                        mkdirRec(path.dirname(dir));
                    }
                }
            };

            if (fs.existsSync(dir)) {
                return;
            }

            let stat;
            mkdirRec(dir);

            try {
                stat = fs.statSync(dir);
            } catch (e) { }

            if (! stat || ! stat.isDirectory()) {
                throw new global.RuntimeException(`Unable to create ${name} directory (${dir})`);
            }
        };

        createDir('logs', this.getLogsDir());
        createDir('cache', this.getCacheDir());

        let container = this._getContainerBuilder();
        container.addObjectResource(this);
        this._prepareContainer(container);

        return container;
    }

    /**
     * Get Container class name
     *
     * @returns {string}
     * @protected
     */
    _getContainerClass() {
        return 'app' + __jymfony.ucfirst(this._environment) + (this._debug ? 'Debug' : '') + 'ProjectContainer';
    }

    /**
     * Create a ContainerBuilder
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     * @protected
     */
    _getContainerBuilder() {
        let builder = new ContainerBuilder();
        builder.parameterBag.add(this._getKernelParameters());

        return builder;
    }

    /**
     * Prepares the container builder to be compiled
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @protected
     */
    _prepareContainer(container) {
        for (let bundle of Object.values(this._bundles)) {
            let extension = bundle.getContainerExtension();

            if (extension) {
                container.registerExtension(extension);
            }

            if (this._debug) {
                container.addObjectResource(bundle);
            }
        }

        for (let bundle of Object.values(this._bundles)) {
            bundle.build(container);
        }
    }

    /**
     * Gets kernel container parameters
     *
     * @returns {Object}
     * @protected
     */
    _getKernelParameters() {
        let bundles = {};
        for (let [ name, bundle ] of __jymfony.getEntries(this._bundles)) {
            let reflClass = new ReflectionClass(bundle);
            bundles[name] = reflClass.name;
        }

        return {
            'kernel.root_dir': this.getRootDir(),
            'kernel.environment': this._environment,
            'kernel.debug': this._debug,
            'kernel.cache_dir': this.getCacheDir(),
            'kernel.logs_dir': this.getLogsDir(),
            'kernel.bundles': Object.keys(bundles),
            'kernel.container_class': this._getContainerClass(),
        };
    }
}

Kernel.VERSION = '0.1.0-dev';
Kernel.VERSION_ID = 100;

module.exports = Kernel;
