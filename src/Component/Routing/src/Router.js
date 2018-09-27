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
        if (undefined === this._matcher) {
            this._matcher = new Jymfony.Component.Routing.Matcher.Matcher(this.routeCollection);
        }

        return this._matcher;
    }

    /**
     * @returns {Jymfony.Component.Routing.Generator.UrlGeneratorInterface}
     */
    get generator() {
        if (undefined === this._generator) {
            this._generator = new Jymfony.Component.Routing.Generator.UrlGenerator(this.routeCollection);
        }

        return this._generator;
    }

    /**
     * @param {Object} options
     */
    set options(options) {
        this._options = Object.assign({}, options);
    }
}

module.exports = Router;
