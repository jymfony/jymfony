const MatcherInterface = Jymfony.Component.Routing.Matcher.MatcherInterface;
const UrlGeneratorInterface = Jymfony.Component.Routing.Generator.UrlGeneratorInterface;
const RouterInterface = Jymfony.Component.Routing.RouterInterface;
const NullLogger = Jymfony.Component.Logger.NullLogger;

/**
 * @memberOf Jymfony.Component.Routing
 */
class Router extends implementationOf(RouterInterface, MatcherInterface, UrlGeneratorInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     * @param {*} resource
     * @param {Jymfony.Component.Logger.LoggerInterface} [logger = new Jymfony.Component.Logger.NullLogger()]
     * @param {Object} [options = {}]
     */
    __construct(loader, resource, logger = new NullLogger(), options = {}) {
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
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger;

        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._collection = undefined;

        this.options = options;
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
        if (undefined === this._matcher) {
            this._matcher = new Jymfony.Component.Routing.Matcher.Matcher(this.routeCollection);
        }

        return this._matcher;
    }

    /**
     * @param {Object} options
     */
    set options(options) {
        this._options = Object.assign({}, options);
    }
}

module.exports = Router;
