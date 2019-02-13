declare namespace Jymfony.Component.Routing {
    import LoaderInterface = Jymfony.Component.Config.Loader.LoaderInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import MatcherInterface = Jymfony.Component.Routing.Matcher.MatcherInterface;
    import UrlGeneratorInterface = Jymfony.Component.Routing.Generator.UrlGeneratorInterface;
    import ConfigCacheFactoryInterface = Jymfony.Component.Config.ConfigCacheFactoryInterface;

    interface RouterOptions {
        cache_dir: string | null,
        debug: boolean,
        resource_type: string | null;
        matcher_class: string;
        matcher_base_class: string;
        matcher_cache_class: string;
        matcher_dumper_class: string;
        strict_requirements: boolean;
    }

    export class Router extends implementationOf(RouterInterface, MatcherInterface, UrlGeneratorInterface) {
        private _loader: LoaderInterface;
        private _resource: any;
        private _collection?: RouteCollection;
        private _matcher?: MatcherInterface;
        private _generator?: UrlGeneratorInterface;
        private _configCacheFactory?: ConfigCacheFactoryInterface;
        private _options: RouterOptions;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
         * @param {*} resource
         * @param {Object} [options = {}]
         */
        __construct(loader: LoaderInterface, resource: any, options?: Partial<RouterOptions>): void;
        constructor(loader: LoaderInterface, resource: any, options?: Partial<RouterOptions>);

        /**
         * @inheritdoc
         */
        withContext(request: Request): Router;

        /**
         * @inheritdoc
         */
        generate(name: any, parameters?: Record<string, any>, referenceType?: number): string;

        public readonly routeCollection: RouteCollection;

        /**
         * @param {Jymfony.Component.HttpFoundation.Request} request
         *
         * @returns {Object<string, *>}
         */
        matchRequest(request: Request): Record<string, any>;

        /**
         * @returns {Jymfony.Component.Routing.Matcher.MatcherInterface}
         */
        public readonly matcher: MatcherInterface;

        public readonly generator: UrlGeneratorInterface;

        public /* writeonly */ options: Partial<RouterOptions>;

        /**
         * @inheritdoc
         */
        warmUp(cacheDir: string): Promise<void>;

        /**
         * Provides the ConfigCache factory implementation, falling back to a
         * default implementation if necessary.
         */
        private _getConfigCacheFactory(): ConfigCacheFactoryInterface;
    }
}
