const ConfiguratorInterface = Jymfony.Component.Routing.Loader.Configurator.ConfiguratorInterface;
const Traits = Jymfony.Component.Routing.Loader.Configurator.Traits;
const Route = Jymfony.Component.Routing.Route;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;

/**
 * @memberOf Jymfony.Component.Routing.Loader.Configurator
 */
class CollectionConfigurator extends implementationOf(
    ConfiguratorInterface, Traits.ConfiguratorTrait,
    Traits.AddTrait, Traits.RouteTrait
) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} parent
     * @param {string} name
     * @param {Object} parentPrefixes
     */
    __construct(parent, name, parentPrefixes = null) {
        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._parent = parent;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._collection = new RouteCollection();

        /**
         * @type {Jymfony.Component.Routing.Route}
         *
         * @private
         */
        this._route = new Route('');

        /**
         * @type {Object}
         *
         * @private
         */
        this._parentPrefixes = parentPrefixes;
    }

    /**
     * @inheritdoc
     */
    build() {
        if (null === this._prefixes) {
            this._collection.addPrefix(this._route.path);
        }

        this._parent.addCollection(this._collection);

        return this._collection;
    }

    /**
     * Creates a sub-collection.
     *
     * @returns {Jymfony.Component.Routing.Loader.Configurator.CollectionConfigurator}
     */
    collection(name = '') {
        return new __self(this._collection, this._name + name, this, this._prefixes);
    }

    /**
     * Sets the prefix to add to the path of all child routes.
     *
     * @param {string|Object} prefix the prefix, or the localized prefixes
     *
     * @returns {Jymfony.Component.Routing.Loader.Configurator.CollectionConfigurator}
     */
    prefix(prefix) {
        if (isObjectLiteral(prefix)) {
            let missing;

            if (null === this._parentPrefixes) {
                // No-op
            } else if (missing = __jymfony.diff_key(this._parentPrefixes, prefix)) {
                throw new LogicException(__jymfony.sprintf('Collection "%s" is missing prefixes for locale(s) "%s".', this._name, Object.keys(missing).join('", "')));
            } else {
                for (const [ locale, localePrefix ] of __jymfony.getEntries(prefix)) {
                    if (! this._parentPrefixes[locale]) {
                        throw new LogicException(__jymfony.sprintf('Collection "%s" with locale "%s" is missing a corresponding prefix in its parent collection.', this._name, locale));
                    }

                    prefix[locale] = this._parentPrefixes[locale] + localePrefix;
                }
            }

            this._prefixes = prefix;
            this._route.setPath('/');
        } else {
            this._prefixes = null;
            this._route.setPath(prefix);
        }

        return this;
    }

    /**
     * Creates a route from path.
     *
     * @param {string} path
     *
     * @returns {Jymfony.Component.Routing.Route}
     *
     * @private
     */
    _createRoute(path) {
        return __jymfony.clone(this._route).setPath(path);
    }
}

module.exports = CollectionConfigurator;
