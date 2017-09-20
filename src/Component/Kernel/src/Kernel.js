const ConfigCache = Jymfony.Component.Config.ConfigCache;
const DelegatingLoader = Jymfony.Component.Config.Loader.DelegatingLoader;
const LoaderResolver = Jymfony.Component.Config.Loader.LoaderResolver;
const DateTime = Jymfony.Component.DateTime.DateTime;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const FileLocator = Jymfony.Component.Kernel.Config.FileLocator;
const KernelInterface = Jymfony.Component.Kernel.KernelInterface;

const fs = require('fs');
const path = require('path');

/**
 * @memberOf Jymfony.Component.Kernel
 */
class Kernel extends implementationOf(KernelInterface) {
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

        /**
         * @type {string}
         * @protected
         */
        this._rootDir = this.getRootDir();

        /**
         * @type {string}
         * @protected
         */
        this._name = this.getName();

        /**
         * @type {undefined|Date}
         * @protected
         */
        this._startTime = undefined;

        if (this._debug) {
            this._startTime = new DateTime();
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

        /**
         * @type {boolean}
         * @private
         */
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

        for (const bundle of this.getBundles()) {
            bundle.setContainer(this._container);
            bundle.boot();
        }

        this._booted = true;
    }

    /**
     * @inheritDoc
     */
    shutdown() {
        if (false === this._booted) {
            return;
        }

        this._booted = false;

        for (const bundle of this.getBundles()) {
            bundle.shutdown();
            bundle.setContainer(undefined);
        }

        this._container = undefined;
    }

    /**
     * @inheritDoc
     */
    getName() {
        if (undefined === this._name) {
            this._name = path.basename(this._rootDir).replace(/[^a-zA-Z0-9_]+/, '');
            if (isNumber(this._name[0])) {
                this._name = `_${this._name}`;
            }
        }

        return this._name;
    }

    /**
     * @inheritDoc
     */
    get environment() {
        return this._environment;
    }

    /**
     * @inheritDoc
     */
    get debug() {
        return this._debug;
    }

    /**
     * @inheritDoc
     */
    get container() {
        return this._container;
    }

    /**
     * Gets the start date time.
     *
     * @return {undefined|Date}
     */
    get startTime() {
        return this._startTime;
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
            const r = new ReflectionClass(this);
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

    /**
     * @inheritDoc
     */
    getBundles() {
        return Object.values(this._bundles);
    }

    /**
     * @inheritDoc
     */
    getBundle(name, first = true) {
        if (undefined === this._bundleMap[name]) {
            throw new InvalidArgumentException(__jymfony.sprintf('Bundle "%s" does not exist or it is not enabled. Maybe you forgot to add it in the registerBundles() method?', name));
        }

        if (true === first) {
            return this._bundleMap[name][0];
        }

        return this._bundleMap[name];
    }

    /**
     * @inheritDoc
     */
    locateResource(name, dir = undefined, first = true) {
        if ('@' !== name.charAt(0)) {
            throw new InvalidArgumentException(__jymfony.sprintf('A resource name must start with @ ("%s" given).', name));
        }

        if (-1 !== name.indexOf('..')) {
            throw new RuntimeException(__jymfony.sprintf('File name "%s" contains invalid characters (..).', name));
        }

        let bundleName = name.substr(1);
        let path = '';
        if (-1 !== bundleName.indexOf('/')) {
            [ bundleName, path ] = bundleName.split('/', 2);
        }

        const isResource = 0 === path.indexOf('Resources') && undefined !== dir;
        const overridePath = path.substr(9);

        let resourceBundle = undefined;
        const bundles = this.getBundle(bundleName, false);
        const files = [];

        for (const bundle of bundles) {
            let file;
            if (isResource && fs.existsSync(file = dir + '/' + bundle.getName() + overridePath)) {
                if (undefined !== resourceBundle) {
                    throw new RuntimeException(__jymfony.sprintf('"%s" resource is hidden by a resource from the "%s" derived bundle. Create a "%s" file to override the bundle resource.',
                        file,
                        resourceBundle,
                        dir + '/' + bundles[0].getName() + overridePath
                    ));
                }

                if (first) {
                    return file;
                }

                files.push(file);
            }

            if (fs.existsSync(file = bundle.path + '/' + path)) {
                if (first && ! isResource) {
                    return file;
                }

                files.push(file);
                resourceBundle = bundle.getName();
            }
        }

        if (0 < files.length) {
            return first && isResource ? files[0] : files;
        }

        throw new InvalidArgumentException(__jymfony.sprintf('Unable to find file "%s".', name));
    }

    /**
     * The extension point similar to the Bundle.build() method.
     *
     * Use this method to register compiler passes and manipulate the container during the building process.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @protected
     */
    _build(container) {
    }

    _initializeBundles() {
        const directChildren = {};
        const topMostBundles = {};

        for (const bundle of this.registerBundles()) {
            const name = bundle.getName();
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
            const bundleMap = [ bundle ];
            const hierarchy = [ name ];

            while (directChildren[name]) {
                name = directChildren[name];
                bundleMap.unshift(this._bundles[name]);
                hierarchy.push(name);
            }

            for (const hierarchyBundle of hierarchy) {
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
        const class_ = this._getContainerClass();
        const cache = new ConfigCache(this.getCacheDir() + '/' + class_ + '.js', this._debug);

        const fresh = cache.isFresh();
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
        const dumper = new Jymfony.Component.DependencyInjection.Dumper.JsDumper(container);
        const options = {
            class_name: this._getContainerClass(),
            debug: this._debug,
        };

        cache.write(dumper.dump(options), container.getResources());
    }

    /**
     * Returns a loader for the container.
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container The service container
     *
     * @returns {Jymfony.Component.Config.Loader.DelegatingLoader} The loader
     *
     * @protected
     */
    _getContainerLoader(container) {
        const locator = new FileLocator(this);
        const resolver = new LoaderResolver([
            new JsFileLoader(container, locator),
        ]);

        return new DelegatingLoader(resolver);
    }

    /**
     * Builds the service container
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     * @protected
     */
    _buildContainer() {
        const createDir = (name, dir) => {
            try {
                __jymfony.mkdir(dir);
            } catch (e) {
                throw new RuntimeException(`Unable to create ${name} directory (${dir})`);
            }
        };

        createDir('logs', this.getLogsDir());
        createDir('cache', this.getCacheDir());

        const container = this._getContainerBuilder();
        container.addObjectResource(this);
        this._prepareContainer(container);

        let cont;
        if (undefined !== (cont = this.registerContainerConfiguration(this._getContainerLoader(container)))) {
            container.merge(cont);
        }

        return container;
    }

    /**
     * @inheritDoc
     */
    registerContainerConfiguration(loader) {
        return undefined;
    };

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
        const builder = new ContainerBuilder();
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
        for (const bundle of Object.values(this._bundles)) {
            const extension = bundle.getContainerExtension();

            if (extension) {
                container.registerExtension(extension);
            }

            if (this._debug) {
                container.addObjectResource(bundle);
            }
        }

        for (const bundle of Object.values(this._bundles)) {
            bundle.build(container);
        }

        this._build(container);
    }

    /**
     * Gets kernel container parameters
     *
     * @returns {Object}
     * @protected
     */
    _getKernelParameters() {
        const bundles = {};
        for (const [ name, bundle ] of __jymfony.getEntries(this._bundles)) {
            const reflClass = new ReflectionClass(bundle);
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
