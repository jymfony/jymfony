declare namespace Jymfony.Component.Kernel {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import ConfigCache = Jymfony.Component.Config.ConfigCache;
    import LoaderInterface = Jymfony.Component.Config.Loader.LoaderInterface;
    import DelegatingLoader = Jymfony.Component.Config.Loader.DelegatingLoader;

    export abstract class Kernel extends implementationOf(KernelInterface) {
        public static readonly VERSION;
        public static readonly VERSION_ID;

        protected _environment: string;
        protected _debug: boolean;
        protected _rootDir: string;
        protected _projectDir: string;
        private _warmupDir: string;
        protected _name: string;
        protected _startTime: DateTimeInterface;
        protected _container: ContainerInterface;
        protected _bundles: Record<string, Bundle>;
        private _booted: boolean;
        private _bundleMap: Record<string, Bundle>;

        /**
         * Constructor.
         */
        __construct(environment: string, debug: boolean): void;
        constructor(environment: string, debug: boolean);

        /**
         * Reboots a kernel.
         *
         * The getCacheDir() method of a rebootable kernel should not be called
         * while building the container. Use the %kernel.cache_dir% parameter instead.
         *
         * @param {undefined|string} warmupDir pass undefined to reboot in the regular cache directory
         */
        reboot(warmupDir: string | undefined): Promise<void>;

        /**
         * Whether this kernel is already booted.
         */
        public readonly booted: boolean;

        /**
         * @inheritdoc
         */
        boot(): Promise<void>;

        /**
         * @inheritdoc
         */
        shutdown(): Promise<void>;

        /**
         * @inheritdoc
         */
        getName(): string;

        /**
         * @inheritdoc
         */
        public readonly environment: string;

        /**
         * @inheritdoc
         */
        public readonly debug: boolean;

        /**
         * @inheritdoc
         */
        public readonly container: ContainerInterface;

        /**
         * Gets the start date time.
         */
        public readonly startTime?: DateTimeInterface;

        /**
         * Get the application logs dir.
         */
        getLogsDir(): string;

        /**
         * Get the application cache dir.
         */
        getCacheDir(): string;

        /**
         * Get the application root dir.
         */
        getRootDir(): string;

        /**
         * Gets the application root dir (path of the project's package.json file).
         */
        getProjectDir(): string;

        /**
         * Gets the bundles to be registered.
         */
        abstract registerBundles(): Bundle[] | IterableIterator<Bundle>;

        /**
         * @inheritdoc
         */
        getBundles(): Bundle[];

        /**
         * @inheritdoc
         */
        getBundle(name: string, first?: true): Bundle;
        getBundle(name: string, first?: false): Bundle[];

        /**
         * @inheritdoc
         */
        locateResource(name: string, dir?: string | undefined, first?: true): string;
        locateResource(name: string, dir?: string | undefined, first?: false): string[];

        /**
         * The extension point similar to the Bundle.build() method.
         *
         * Use this method to register compiler passes and manipulate the container during the building process.
         */
        protected _build(container: ContainerBuilder): void;

        /**
         * @private
         */
        private _initializeBundles(): void;

        /**
         * Initializes the service container.
         *
         * The cached version of the service container is used when fresh, otherwise a
         * new container is built.
         *
         * @param [refresh = false] Force rebuild the container.
         */
        protected _initializeContainer(refresh?: boolean): void;

        /**
         * Dumps the container in JS code in cache.
         */
        protected _dumpContainer(container: ContainerBuilder, cache: ConfigCache): void;

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
         */
        protected _configureContainer(container: ContainerBuilder, loader: LoaderInterface): void;

        /**
         * Returns a loader for the container.
         */
        protected _getContainerLoader(container: ContainerInterface): DelegatingLoader;

        /**
         * Builds the service container
         *
         * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @protected
         */
        protected _buildContainer(): ContainerBuilder;

        /**
         * @inheritdoc
         */
        registerContainerConfiguration(loader: LoaderInterface): void;

        /**
         * Get Container class name.
         */
        protected _getContainerClass(): string;

        /**
         * Create a ContainerBuilder.
         */
        protected _getContainerBuilder(): ContainerBuilder;

        /**
         * Prepares the container builder to be compiled.
         */
        protected _prepareContainer(container: ContainerBuilder): void;

        /**
         * Gets kernel container parameters.
         */
        protected _getKernelParameters(): Record<string, any>;
    }
}
