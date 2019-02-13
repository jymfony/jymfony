const ConfigCacheFactory = Jymfony.Component.Config.ConfigCacheFactory;
const OptionsResolver = Jymfony.Component.OptionsResolver.OptionsResolver;
const MatcherInterface = Jymfony.Component.Routing.Matcher.MatcherInterface;
const UrlGeneratorInterface = Jymfony.Component.Routing.Generator.UrlGeneratorInterface;
const RouterInterface = Jymfony.Component.Routing.RouterInterface;

/**
 * @memberOf Jymfony.Component.Routing
 */
class Router extends implementationOf(RouterInterface, MatcherInterface, UrlGeneratorInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     * @param {*} resource
     * @param {Object} [options = {}]
     */
    __construct(loader, resource, options = {}) {
        /**
         * @type {Jymfony.Component.Config.Loader.LoaderInterface}
         *
         * @private
         */
        this._loader = loader;

        /**
         * @type {*}
         *
         * @private
         */
        this._resource = resource;

        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._collection = undefined;

        /**
         * @type {Jymfony.Component.Routing.Matcher.MatcherInterface}
         *
         * @private
         */
        this._matcher = undefined;

        /**
         * @type {Jymfony.Component.Routing.Generator.UrlGeneratorInterface}
         *
         * @private
         */
        this._generator = undefined;

        /**
         * @type {Jymfony.Component.Config.ConfigCacheFactoryInterface}
         *
         * @private
         */
        this._configCacheFactory = undefined;

        this.options = options;
    }

    /**
     * @inheritdoc
     */
    withContext(request) {
        return this.generator.withContext(request);
    }

    /**
     * @inheritdoc
     */
    generate(name, parameters = {}, referenceType = UrlGeneratorInterface.ABSOLUTE_PATH) {
        return this.generator.generate(name, parameters, referenceType);
    }

    /**
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    get routeCollection() {
        if (undefined === this._collection) {
            this._collection = this._loader.load(this._resource, this._options.resource_type);
        }

        return this._collection;
    }

    /**
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Object<string, *>}
     */
    matchRequest(request) {
        return this.matcher.matchRequest(request);
    }

    /**
     * @returns {Jymfony.Component.Routing.Matcher.MatcherInterface}
     */
    get matcher() {
        if (undefined !== this._matcher) {
            return this._matcher;
        }

        if (! this._options.cache_dir || ! this._options.matcher_cache_class) {
            const reflClass = new ReflectionClass(this._options.matcher_class);
            return this._matcher = reflClass.newInstance(this.routeCollection);
        }


        const cache = this._getConfigCacheFactory()
            .cache(this._options.cache_dir + '/' + this._options.matcher_cache_class + '.js',
                (cache) => {
                    const reflClass = new ReflectionClass(this._options.matcher_dumper_class);
                    const dumper = reflClass.newInstance(this.routeCollection);
                    const options = {
                        'class': this._options.matcher_cache_class,
                        'base_class': this._options.matcher_base_class,
                    };

                    cache.write(dumper.dump(options), this.routeCollection.resources);
                }
            );

        return this._matcher = new (require(cache.getPath()))(this.routeCollection);
    }

    /**
     * @returns {Jymfony.Component.Routing.Generator.UrlGeneratorInterface}
     */
    get generator() {
        if (undefined !== this._generator) {
            return this._generator;
        }

        return this._generator = new Jymfony.Component.Routing.Generator.UrlGenerator(this.routeCollection);
    }

    /**
     * @param {Object} options
     */
    set options(options) {
        const resolver = new OptionsResolver();
        resolver.setDefaults({
            'cache_dir': null,
            'debug': false,
            // 'generator_class': 'Jymfony.Component.Routing.Generator.UrlGenerator',
            // 'generator_base_class': 'Jymfony.Component.Routing.Generator.UrlGenerator',
            // 'generator_dumper_class': 'Jymfony.Component.Routing.Generator.Dumper.JsGeneratorDumper',
            // 'generator_cache_class': 'ProjectUrlGenerator',
            'matcher_class': 'Jymfony.Component.Routing.Matcher.Matcher',
            'matcher_base_class': 'Jymfony.Component.Routing.Matcher.Matcher',
            'matcher_dumper_class': 'Jymfony.Component.Routing.Dumper.JsMatcherDumper',
            'matcher_cache_class': 'ProjectUrlMatcher',
            'resource_type': null,
            'strict_requirements': true,
        });

        this._options = resolver.resolve(options);
    }

    /**
     * @inheritdoc
     */
    async warmUp(cacheDir) {
        const currentDir = this._options.cache_dir;

        // Force cache generation
        this._options.cache_dir = cacheDir;
        const matcher = this.matcher;
        const generator = this.generator;

        this._options.cache_dir = currentDir;

        return !! matcher && !! generator;
    }

    /**
     * Provides the ConfigCache factory implementation, falling back to a
     * default implementation if necessary.
     *
     * @return {Jymfony.Component.Config.ConfigCacheFactoryInterface}
     */
    _getConfigCacheFactory() {
        if (undefined === this._configCacheFactory) {
            this._configCacheFactory = new ConfigCacheFactory(!! this._options.debug);
        }

        return this._configCacheFactory;
    }
}

module.exports = Router;
