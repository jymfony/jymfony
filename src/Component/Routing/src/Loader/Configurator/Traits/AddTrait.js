const CollectionConfigurator = Jymfony.Component.Routing.Loader.Configurator.CollectionConfigurator;
const RouteConfigurator = Jymfony.Component.Routing.Loader.Configurator.RouteConfigurator;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;
const Route = Jymfony.Component.Routing.Route;

/**
 * @memberOf Jymfony.Component.Routing.Loader.Configurator.Traits
 */
class AddTrait {
    __construct() {
        /**
         * @type {string}
         *
         * @private
         */
        this._name = '';

        /**
         * @type {*}
         *
         * @private
         */
        this._prefixes = null;
    }

    /**
     * Adds a route.
     *
     * @param {string} name The name of the route
     * @param {string|Object} path the path, or the localized paths of the route
     *
     * @returns {Jymfony.Component.Routing.Loader.Configurator.RouteConfigurator}
     *
     * @final
     */
    add(name, path) {
        let paths = [];
        const parentConfigurator = this instanceof CollectionConfigurator ? this : (this instanceof RouteConfigurator ? this._parentConfigurator : null);

        if (isObjectLiteral(path)) {
            let missing;

            if (null === this._prefixes) {
                paths = path;
            } else if (missing = __jymfony.diff_key(this._prefixes, path)) {
                throw new LogicException(__jymfony.sprintf('Route "%s" is missing routes for locale(s) "%s".', name, Object.keys(missing).join('", "')));
            } else {
                for (const [ locale, localePath ] of __jymfony.getEntries(path)) {
                    if (! this._prefixes[locale]) {
                        throw new LogicException(__jymfony.sprintf('Route "%s" with locale "%s" is missing a corresponding prefix in its parent collection.', name, locale));
                    }

                    paths[locale] = this._prefixes[locale] + localePath;
                }
            }
        } else if (null !== this._prefixes) {
            for (const [ locale, prefix ] of __jymfony.getEntries(this._prefixes)) {
                paths[locale] = prefix + path;
            }
        } else {
            const route = this._createRoute(path);
            this._collection.add(this._name + name, route);

            return parentConfigurator._push(new RouteConfigurator(this._collection, route, this._name, parentConfigurator, this._prefixes));
        }

        const routes = new RouteCollection();

        for (const [ locale, path ] of paths) {
            const route = this._createRoute(path);
            routes.add(name + '.' + locale, route);
            this._collection.add(this._name + name + '.' + locale, route);
            route.setDefault('_locale', locale);
            route.setDefault('_canonical_route', this._name + name);
        }

        return parentConfigurator._push(new RouteConfigurator(this._collection, routes, this._name, parentConfigurator, this._prefixes));
    }

    /**
     * Adds a route.
     *
     * @param {string} name The route name
     * @param {string|Object} path the path, or the localized paths of the route
     */
    __invoke(name, path) {
        return this.add(name, path);
    }

    /**
     * Creates a Route object.
     *
     * @param {string} path
     * @returns {Jymfony.Component.Routing.Route}
     *
     * @private
     */
    _createRoute(path) {
        return new Route(path);
    }
}

export default getTrait(AddTrait);
