const RouteTrait = Jymfony.Component.Routing.Loader.Configurator.Traits.RouteTrait;
const Route = Jymfony.Component.Routing.Route;

/**
 * @memberOf Jymfony.Component.Routing.Loader.Configurator
 */
class ImportConfigurator extends implementationOf(RouteTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} parent
     * @param {Jymfony.Component.Routing.RouteCollection} route
     */
    __construct(parent, route) {
        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._parent = parent;

        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._route = route;
    }

    /**
     * @inheritdoc
     */
    build() {
        this._parent.addCollection(this._route);

        return this._parent;
    }

    /**
     * Sets the prefix to add to the path of all child routes.
     *
     * @param {string|Object.<string, string>} prefix the prefix, or the localized prefixes
     * @param {boolean} trailingSlashOnRoot
     *
     * @returns {Jymfony.Component.Routing.Loader.Configurator.ImportConfigurator}
     *
     * @final
     */
    prefix(prefix, trailingSlashOnRoot = true) {
        if (! isObjectLiteral(prefix)) {
            this._route.addPrefix(prefix);
            if (! trailingSlashOnRoot) {
                const rootPath = new Route(__jymfony.trim(__jymfony.trim(prefix), '/') + '/').path;
                for (const route of Object.values(this._route.all())) {
                    if (route.path === rootPath) {
                        route.setPath(__jymfony.rtrim(rootPath, '/'));
                    }
                }
            }
        } else {
            for (const [ locale, localePrefix ] of __jymfony.getEntries(prefix)) {
                prefix[locale] = __jymfony.trim(__jymfony.trim(localePrefix), '/');
            }

            for (const [ name, route ] of __jymfony.getEntries(this._route.all())) {
                let locale;
                if (undefined === (locale = route.getDefault('_locale'))) {
                    this._route.remove(name);
                    for (const [ locale, localePrefix ] of __jymfony.getEntries(prefix)) {
                        const localizedRoute = __jymfony.clone(route);
                        localizedRoute.setDefault('_locale', locale);
                        localizedRoute.setDefault('_canonical_route', name);
                        localizedRoute.setPath(localePrefix + (! trailingSlashOnRoot && '/' === route.path ? '' : route.path));
                        this._route.add(name + '.' + locale, localizedRoute);
                    }
                } else if (!! prefix[locale]) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Route "%s" with locale "%s" is missing a corresponding prefix in its parent collection.', name, locale));
                } else {
                    route.setPath(prefix[locale] + (! trailingSlashOnRoot && '/' === route.path ? '' : route.path));
                    this._route.add(name, route);
                }
            }
        }

        return this;
    }

    /**
     * Sets the prefix to add to the name of all child routes.
     *
     * @param {string} namePrefix
     *
     * @returns {Jymfony.Component.Routing.Loader.Configurator.ImportConfigurator}
     */
    namePrefix(namePrefix) {
        this._route.addNamePrefix(namePrefix);

        return this;
    }
}

module.exports = ImportConfigurator;
