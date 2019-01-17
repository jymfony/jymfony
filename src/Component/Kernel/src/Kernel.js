const ConfigCache = Jymfony.Component.Config.ConfigCache;
const DelegatingLoader = Jymfony.Component.Config.Loader.DelegatingLoader;
const LoaderResolver = Jymfony.Component.Config.Loader.LoaderResolver;
const DateTime = Jymfony.Component.DateTime.DateTime;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Loader = Jymfony.Component.DependencyInjection.Loader;
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
         *
         * @protected
         */
        this._environment = environment;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._debug = debug;

        /**
         * @type {string}
         *
         * @protected
         */
        this._rootDir = this.getRootDir();

        /**
         * @type {string}
         *
         * @protected
         */
        this._projectDir = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._warmupDir = undefined;

        /**
         * @type {string}
         *
         * @protected
         */
        this._name = this.getName();

        /**
         * @type {Jymfony.Component.DateTime.DateTime}
         *
         * @protected
         */
        this._startTime = undefined;

        if (this._debug) {
            this._startTime = new DateTime();
        }

        /**
         * @type {Jymfony.Component.DependencyInjection.Container}
         *
         * @protected
         */
        this._container = undefined;

        /**
         * @type {Object.<Jymfony.Component.Kernel.Bundle>}
         *
         * @protected
         */
        this._bundles = {};

        /**
         * @type {boolean}
         *
         * @private
         */
        this._booted = false;

        /**
         * @type {Object}
         *
         * @private
         */
        this._bundleMap = {};
    }

    /**
     * Reboots a kernel.
     *
     * The getCacheDir() method of a rebootable kernel should not be called
     * while building the container. Use the %kernel.cache_dir% parameter instead.
     *
     * @param {undefined|string} warmupDir pass undefined to reboot in the regular cache directory
     */
    async reboot(warmupDir) {
        await this.shutdown();
        this._warmupDir = warmupDir;
        await this.boot();
    }

    /**
     * @inheritdoc
     */
    async boot() {
        if (this._booted) {
            return;
        }

        this._initializeBundles();
        this._initializeContainer();

        for (const bundle of this.getBundles()) {
            bundle.setContainer(this._container);
            await bundle.boot();
        }

        this._booted = true;
    }

    /**
     * @inheritdoc
     */
    async shutdown() {
        if (false === this._booted) {
            return;
        }

        this._booted = false;

        for (const bundle of this.getBundles()) {
            await bundle.shutdown();
            bundle.setContainer(undefined);
        }

        await this._container.shutdown();
        this._container = undefined;
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    get environment() {
        return this._environment;
    }

    /**
     * @inheritdoc
     */
    get debug() {
        return this._debug;
    }

    /**
     * @inheritdoc
     */
    get container() {
        return this._container;
    }

    /**
     * Gets the start date time.
     *
     * @returns {undefined|Jymfony.Component.DateTime.DateTime}
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
        return path.normalize(path.join(this.getRootDir(), '..', 'var', 'cache', this.environment));
    }

    /**
     * Get the application root dir
     *
     * @returns {string}
     */
    getRootDir() {
        if (undefined === this._rootDir) {
            let r = new ReflectionClass(this);
            if (undefined === r.filename) {
                r = new ReflectionClass(__self);
            }

            this._rootDir = path.dirname(r.filename);
        }

        return this._rootDir;
    }

    /**
     * Gets the application root dir (path of the project's package.json file).
     *
     * @returns {string} The project root dir
     */
    getProjectDir() {
        if (undefined === this._projectDir) {
            let dir, rootDir;
            dir = rootDir = this.getRootDir();
            while (! fs.existsSync(dir + '/package.json')) {
                if (dir === path.dirname(dir)) {
                    return this._projectDir = rootDir;
                }

                dir = path.dirname(dir);
            }

            this._projectDir = dir;
        }

        return this._projectDir;
    }

    /**
     * Gets the bundles to be registered
     *
     * @returns {Jymfony.Component.Kernel.Bundle[]}
     *
     * @abstract
     */
    * registerBundles() {
        throw new Error('You must override registerBundles method');
    }

    /**
     * @inheritdoc
     */
    getBundles() {
        return Object.values(this._bundles);
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
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
    _build(container) { } // eslint-disable-line no-unused-vars

    /**
     * @private
     */
    _initializeBundles() {
        const directChildren = {};
        const topMostBundles = {};
        this._bundles = {};

        for (const bundle of this.registerBundles()) {
            const name = bundle.getName();
            if (this._bundles[name]) {
                throw new LogicException(`Trying to register two bundles with the same name "${name}"`);
            }

            this._bundles[name] = bundle;
            let parentName;
            if ((parentName = bundle.getParent())) {
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
     * @param {boolean} [refresh = false] Force rebuild the container.
     *
     * @protected
     */
    _initializeContainer(refresh = false) {
        let container;
        const class_ = this._getContainerClass();
        const cacheDir = this._warmupDir || this.getCacheDir();
        const cache = new ConfigCache(cacheDir + '/' + class_ + '.js', this._debug);

        const fresh = cache.isFresh() && ! refresh;
        if (fresh) {
            this._container = require(cache.getPath());
            this._container.set('kernel', this);

            return;
        }

        const collectedLogs = {};
        let fnWarning;
        if (this._debug) {
            process.addListener('warning', fnWarning = warning => {
                if ('DeprecationWarning' !== warning.name) {
                    return;
                }

                collectedLogs[warning.message] = {
                    message: warning.message,
                    code: warning.code,
                    stack: warning.stack,
                    detail: warning.detail,
                };
            });
        }

        container = undefined;
        try {
            container = this._buildContainer();
            container.compile();
        } finally {
            if (this._debug) {
                process.removeListener('warning', fnWarning);

                fs.writeFileSync(cacheDir + '/' + class_ + 'Deprecations.log', JSON.stringify(Object.values(collectedLogs)), null, 2);
                fs.writeFileSync(cacheDir + '/' + class_ + 'Compiler.log', undefined !== container ? container.getCompiler().getLogs().join('\n') : '');
            }
        }

        this._dumpContainer(container, cache);

        this._container = require(cache.getPath());
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
            build_time: container.hasParameter('kernel.container_build_time') ? container.getParameter('kernel.container_build_time') : DateTime.unixTime,
        };

        const codes = Array.from(__jymfony.getEntries(dumper.dump(options)));
        const rootCode = codes.pop();

        const dir = path.dirname(cache.getPath()) + '/';
        for (const [ file, code ] of codes) {
            const target = dir+file;

            try {
                fs.mkdirSync(path.dirname(target));
            } catch (e) {
                // Do nothing
            }

            fs.writeFileSync(target, code, {
                mode: 0o666,
            });
        }

        cache.write(rootCode[1], container.getResources());
    }

    /**
     * Configures the container.
     * You can register extensions:
     *
     * container.loadFromExtension('framework', {
     *     secret: '%secret%',
     * });
     *
     * Or services:
     *
     * container.register('halloween', 'FooBundle.HalloweenProvider');
     *
     * Or parameters:
     *
     * container.setParameter('halloween', 'lot of fun');
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     *
     * @protected
     */
    _configureContainer(container, loader) { } // eslint-disable-line no-unused-vars

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
            new Loader.JsFileLoader(container, locator),
            new Loader.JsonFileLoader(container, locator),
            new Loader.FunctionLoader(container),
        ]);

        return new DelegatingLoader(resolver);
    }

    /**
     * Builds the service container
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     *
     * @protected
     */
    _buildContainer() {
        const createDir = (name, dir) => {
            try {
                __jymfony.mkdir(dir);
            } catch (e) {
                if ('EEXIST' === e.code) {
                    return;
                }

                throw new RuntimeException(`Unable to create ${name} directory (${dir})`);
            }
        };

        createDir('logs', this.getLogsDir());
        createDir('cache', this._warmupDir || this.getCacheDir());

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
     * @inheritdoc
     */
    registerContainerConfiguration(loader) {
        loader.load((container) => {
            this._configureContainer(container, loader);
            container.addObjectResource(this);
        });
    };

    /**
     * Get Container class name
     *
     * @returns {string}
     *
     * @protected
     */
    _getContainerClass() {
        return 'app' + __jymfony.ucfirst(this._environment) + (this._debug ? 'Debug' : '') + 'ProjectContainer';
    }

    /**
     * Create a ContainerBuilder
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     *
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
     *
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
     *
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
            'kernel.project_dir': this.getProjectDir(),
            'kernel.environment': this._environment,
            'kernel.debug': this._debug,
            'kernel.cache_dir': this._warmupDir || this.getCacheDir(),
            'kernel.logs_dir': this.getLogsDir(),
            'kernel.bundles': Object.keys(bundles),
            'kernel.container_class': this._getContainerClass(),
        };
    }
}

Kernel.VERSION = '0.1.0-dev';
Kernel.VERSION_ID = 100;

module.exports = Kernel;
