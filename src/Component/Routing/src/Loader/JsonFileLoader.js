import { dirname, extname } from 'path';
import { existsSync, readFileSync } from 'fs';

const FileLoader = Jymfony.Component.Config.Loader.FileLoader;
const FileResource = Jymfony.Component.Config.Resource.FileResource;
const Route = Jymfony.Component.Routing.Route;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;

const availableKeys = [
    'resource', 'type', 'prefix', 'path',
    'host', 'schemes', 'methods', 'defaults',
    'requirements', 'options', 'condition',
    'controller', 'name_prefix', 'trailing_slash_on_root',
    'locale', 'format',
];

/**
 * JsonFileLoader loads JSON routing files.
 *
 * @memberOf Jymfony.Component.Routing.Loader
 */
export default class JsonFileLoader extends FileLoader {
    /**
     * Loads a JSON file.
     *
     * @param {string} file A JSON file path
     *
     * @returns {Jymfony.Component.Routing.RouteCollection} A RouteCollection instance
     *
     * @throws {InvalidArgumentException} When a route can't be parsed because JSON is invalid
     */
    load(file) {
        const path = this._locator.locate(file);
        if (! existsSync(path)) {
            throw new InvalidArgumentException(__jymfony.sprintf('File "%s" not found.', path));
        }

        const content = readFileSync(path).toString('utf-8');

        let parsedConfig;
        try {
            parsedConfig = content ? JSON.parse(content) : null;
        } catch (e) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not contain valid JSON.', path), 0, e);
        }

        return this._doLoad(parsedConfig, path, file);
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = null) {
        if (! isString(resource)) {
            return false;
        }

        if (null === type && '.json' === extname(resource)) {
            return true;
        }

        return 'json' === type;
    }

    /**
     * Loads a parsed configuration.
     *
     * @param {*} parsedConfig
     * @param {string} path
     * @param {string} file
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     *
     * @protected
     */
    _doLoad(parsedConfig, path, file) {
        const collection = new RouteCollection();
        collection.addResource(new FileResource(path));

        // Empty file
        if (null === parsedConfig) {
            return collection;
        }

        // Not an array
        if (! isObjectLiteral(parsedConfig)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" must contain a JSON object.', path));
        }

        for (const [ name, config ] of __jymfony.getEntries(parsedConfig)) {
            this._validate(config, name, path);

            if (undefined !== config.resource) {
                this._parseImport(collection, config, path, file);
            } else {
                this._parseRoute(collection, name, config);
            }
        }

        return collection;
    }

    /**
     * Parses a route and adds it to the RouteCollection.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} collection A RouteCollection instance
     * @param {string} name Route name
     * @param {*} config Route definition
     *
     * @protected
     */
    _parseRoute(collection, name, config) {
        const defaults = config.defaults || {};
        const requirements = config.requirements;
        const options = config.options;
        const host = config.host;
        const schemes = config.schemes;
        const methods = config.methods;

        if (undefined !== config.controller) {
            defaults._controller = config.controller;
        }
        if (undefined !== config.locale) {
            defaults._locale = config.locale;
        }
        if (undefined !== config.format) {
            defaults._format = config.format;
        }

        if (isObjectLiteral(config.path)) {
            const route = new Route('', defaults, requirements, options, host, schemes, methods);

            for (const [ locale, path ] of __jymfony.getEntries(config.path)) {
                const localizedRoute = __jymfony.clone(route);
                localizedRoute.setDefault('_locale', locale);
                localizedRoute.setDefault('_canonical_route', name);
                localizedRoute.setPath(path);
                collection.add(name + '.' + locale, localizedRoute);
            }
        } else {
            const route = new Route(config.path, defaults, requirements, options, host, schemes, methods);
            collection.add(name, route);
        }
    }

    /**
     * Parses an import and adds the routes in the resource to the RouteCollection.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} collection A RouteCollection instance
     * @param {*} config Route definition
     * @param {string} path Full path of the file being processed
     * @param {string} file Loaded file name
     *
     * @protected
     */
    _parseImport(collection, config, path, file) {
        const type = config.type || null;
        const prefix = undefined !== config.prefix ? config.prefix : '';
        const defaults = config.defaults || {};
        const requirements = config.requirements || {};
        const options = config.options || {};
        const host = config.host;
        const schemes = config.schemes ? config.schemes : null;
        const methods = config.methods;

        const trailingSlashOnRoot = undefined !== config.trailing_slash_on_root ? config.trailing_slash_on_root : true;

        if (undefined !== config.controller) {
            defaults._controller = config.controller;
        }
        if (undefined !== config.locale) {
            defaults._locale = config.locale;
        }
        if (undefined !== config.format) {
            defaults._format = config.format;
        }

        this.currentDir = dirname(path);
        let imported = this.importResource(config.resource, type, false, file);

        if (! isArray(imported)) {
            imported = [ imported ];
        }

        for (const subCollection of imported) {
            if (! isObjectLiteral(prefix)) {
                subCollection.addPrefix(prefix);
                if (! trailingSlashOnRoot) {
                    const rootPath = (new Route(__jymfony.trim(__jymfony.trim(prefix), '/') + '/')).path;
                    for (const route of Object.values(subCollection.all())) {
                        if (route.path === rootPath) {
                            route.setPath(__jymfony.rtrim(rootPath, '/'));
                        }
                    }
                }
            } else {
                for (const [ locale, localePrefix ] of __jymfony.getEntries(prefix)) {
                    prefix[locale] = __jymfony.trim(__jymfony.trim(localePrefix), '/');
                }

                for (const [ name, route ] of __jymfony.getEntries(subCollection.all())) {
                    const locale = route.getDefault('_locale');
                    if (undefined === locale) {
                        subCollection.remove(name);
                        for (const [ locale, localePrefix ] of __jymfony.getEntries(prefix)) {
                            const localizedRoute = __jymfony.clone(route);
                            localizedRoute.setDefault('_locale', locale);
                            localizedRoute.setDefault('_canonical_route', name);
                            localizedRoute.setPath(localePrefix + (! trailingSlashOnRoot && '/' === route.path ? '' : route.path));
                            subCollection.add(name + '.' + locale, localizedRoute);
                        }
                    } else if (undefined === prefix[locale]) {
                        throw new InvalidArgumentException(__jymfony.sprintf('Route "%s" with locale "%s" is missing a corresponding prefix when imported in "%s".', name, locale, file));
                    } else {
                        route.setPath(prefix[locale] + (! trailingSlashOnRoot && '/' === route.path ? '' : route.path));
                        subCollection.add(name, route);
                    }
                }
            }

            if (null !== host) {
                subCollection.addHost(host);
            }
            if (null !== schemes) {
                subCollection.setSchemes(schemes);
            }
            if (undefined !== methods) {
                subCollection.setMethods(methods);
            }

            subCollection.addDefaults(defaults);
            subCollection.addRequirements(requirements);
            subCollection.addOptions(options);

            if (undefined !== config.name_prefix) {
                subCollection.addNamePrefix(config.name_prefix);
            }

            collection.addCollection(subCollection);
        }
    }

    /**
     * Validates the route configuration.
     *
     * @param {*} config A resource config
     * @param {string} name The config key
     * @param {string} path The loaded file path
     *
     * @throws {InvalidArgumentException} If one of the provided config keys is not supported,
     *                                    something is missing or the combination is nonsense
     *
     * @private
     */
    _validate(config, name, path) {
        if (! isObjectLiteral(config)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The definition of "%s" in "%s" must be an object.', name, path));
        }

        const extraKeys = Object.keys(config).filter(k => ! availableKeys.includes(k));
        if (0 !== extraKeys.length) {
            throw new InvalidArgumentException(__jymfony.sprintf('The routing file "%s" contains unsupported keys for "%s": "%s". Expected one of: "%s".', path, name, extraKeys.join('", "'), availableKeys.join('", "')));
        }

        if (undefined !== config.resource && undefined !== config.path) {
            throw new InvalidArgumentException(__jymfony.sprintf('The routing file "%s" must not specify both the "resource" key and the "path" key for "%s". Choose between an import and a route definition.', path, name));
        }

        if (undefined === config.resource && undefined !== config.type) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "type" key for the route definition "%s" in "%s" is unsupported. It is only available for imports in combination with the "resource" key.', name, path));
        }

        if (undefined === config.resource && undefined === config.path) {
            throw new InvalidArgumentException(__jymfony.sprintf('You must define a "path" for the route "%s" in file "%s".', name, path));
        }

        if (undefined !== config.controller && undefined !== config.defaults && undefined !== config.defaults._controller) {
            throw new InvalidArgumentException(__jymfony.sprintf('The routing file "%s" must not specify both the "controller" key and the defaults key "_controller" for "%s".', path, name));
        }
    }
}
