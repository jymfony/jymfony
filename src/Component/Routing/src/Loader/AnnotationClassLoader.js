const LoaderInterface = Jymfony.Component.Config.Loader.LoaderInterface;
const FileResource = Jymfony.Component.Config.Resource.FileResource;
const Route = new ReflectionClass(Jymfony.Component.Routing.Annotation.Route).getConstructor();
const RoutingRoute = Jymfony.Component.Routing.Route;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;

/**
 * AnnotationClassLoader loads routing information from a class and its methods.
 *
 * You need to define an implementation for the getRouteDefaults() method. Most of the
 * time, this method should define a function to be called for the route
 * (a controller in MVC speak).
 *
 * The @Route decorator can be set on the class (for global parameters),
 * and on each method.
 *
 * The @Route decorator main value is the route path. The annotation also
 * recognizes several parameters: requirements, options, defaults, schemes,
 * methods, host, and name.
 * Here is an example of how you should be able to use it:
 *     @Route("/Blog")
 *     export default class Blog {
 *         @Route({ path: "/", name: "blog_index" })
 *         index() {
 *         }
 *
 *         @Route({ path: "/{id}", name: "blog_post", requirements: { id: "\d+" } })
 *         show() {
 *         }
 *     }
 *
 * @abstract
 *
 * @memberOf Jymfony.Component.Routing.Loader
 */
export default class AnnotationClassLoader extends implementationOf(LoaderInterface) {
    __construct() {
        /**
         * @type {int}
         *
         * @protected
         */
        this._defaultRouteIndex = 0;
    }

    /**
     * Loads from annotations from a class.
     *
     * @param {string} class_ A class name
     *
     * @returns {Jymfony.Component.Routing.RouteCollection} A RouteCollection instance
     *
     * @throws {InvalidArgumentException} When route can't be parsed
     */
    load(class_) {
        if (! ReflectionClass.exists(class_)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Class "%s" does not exist.', class_));
        }

        const reflectionClass = new ReflectionClass(class_);
        let globals = this._getGlobals(reflectionClass);

        const collection = new RouteCollection();
        collection.addResource(new FileResource(reflectionClass.filename));

        for (const methodName of reflectionClass.methods) {
            const method = reflectionClass.getMethod(methodName);
            this._defaultRouteIndex = 0;
            for (const [ annotationClass, annotations ] of method.metadata) {
                if (annotationClass === Route) {
                    this._addRoute(collection, annotations, globals, reflectionClass, method);
                }
            }
        }

        if (0 === collection.length && reflectionClass.hasMethod('__invoke')) {
            globals = this._resetGlobals();
            for (const [ annotationClass, annotations ] of reflectionClass.metadata) {
                if (annotationClass === Route) {
                    this._addRoute(collection, annotations, globals, reflectionClass, reflectionClass.getMethod('__invoke'));
                }
            }
        }

        return collection;
    }

    /**
     * @param {Jymfony.Component.Routing.RouteCollection} collection
     * @param {Route|Route[]} annotations
     * @param {Object.<string, *>} globals
     * @param {ReflectionClass} reflectionClass
     * @param {ReflectionMethod} method
     *
     * @protected
     */
    _addRoute(collection, annotations, globals, reflectionClass, method) {
        if (! isArray(annotations)) {
            annotations = [ annotations ];
        }

        const coerceArray = v => isArray(v) ? v : [ v ];

        for (const annot of annotations) {
            let name = annot.name;
            if (! name) {
                name = this._getDefaultRouteName(reflectionClass, method);
            }

            name = globals.name + name;
            const requirements = { ...globals.requirements, ...(annot.requirements || {}) };
            const defaults = { ...globals.defaults, ...(annot.defaults || {}) };
            const options = { ...globals.options, ...(annot.options || {}) };

            const schemes = [ ...globals.schemes, ...coerceArray(annot.schemes || [ 'http', 'https' ]) ];
            const methods = [ ...globals.methods, ...coerceArray(annot.methods || [ 'GET', 'POST' ]) ];
            const host = annot.host || globals.host;
            const condition = annot.condition || globals.condition;
            const path = annot.localizedPaths || annot.path || '';

            const prefix = (globals.localizedPaths && 0 < Object.keys(globals.localizedPaths).length) ?
                globals.localizedPaths :
                globals.path || '';
            const paths = {};

            if (isObjectLiteral(path)) {
                if (! isObjectLiteral(prefix)) {
                    for (const [ locale, localePath ] of __jymfony.getEntries(path)) {
                        paths[locale] = prefix + localePath;
                    }
                } else {
                    const pathKeys = Object.keys(path);
                    const missing = [ ...Object.keys(prefix) ].filter(v => -1 === pathKeys.indexOf(v));

                    if (0 < missing.length) {
                        throw new LogicException(__jymfony.sprintf(
                            'Route to "%s" is missing paths for locale(s) "%s".',
                            reflectionClass.name + '.' + method.name,
                            missing.join('", "')
                        ));
                    } else {
                        for (const [ locale, localePath ] of __jymfony.getEntries(path)) {
                            if (undefined === prefix[locale]) {
                                throw new LogicException(__jymfony.sprintf(
                                    'Route to "%s" with locale "%s" is missing a corresponding prefix in class "%s".',
                                    method.name,
                                    locale,
                                    reflectionClass.name
                                ));
                            }

                            paths[locale] = prefix[locale] + localePath;
                        }
                    }
                }
            } else if (isObjectLiteral(prefix)) {
                for (const [ locale, localePrefix ] of __jymfony.getEntries(prefix)) {
                    paths[locale] = localePrefix + path;
                }
            } else {
                paths[0] = prefix + path;
            }

            for (const param of method.parameters) {
                if (param.isArrayPattern || param.isObjectPattern || param.isRestElement ||
                    undefined !== defaults[param.name] || undefined === param.defaultValue) {
                    continue;
                }

                for (const path of Object.values(paths)) {
                    const regex = new RegExp('\{' + __jymfony.regex_quote(param.name) + '(?:<.*?>)?\}');
                    if (path.match(regex)) {
                        defaults[param.name] = param.defaultValue;
                        break;
                    }
                }
            }

            for (const [ locale, path ] of __jymfony.getEntries(paths)) {
                const route = this._createRoute(path, defaults, requirements, options, host, schemes, methods, condition);
                this._configureRoute(route, reflectionClass, method, annot);
                if ('0' !== locale) {
                    route.setDefault('_locale', locale);
                    route.setDefault('_canonical_route', name);
                    collection.add(name + '.' + locale, route);
                } else {
                    collection.add(name, route);
                }
            }
        }
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = null) {
        if ('annotation' === type) {
            return true;
        }

        if (isString(resource) && resource.startsWith('.')) {
            return false;
        }

        if (type || (isString(resource) && ! resource.match(/^(?:\.?[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)+$/))) {
            return false;
        }

        if (isString(resource)) {
            const parts = resource.split('.');
            resource = ReflectionClass._recursiveGet(global, parts);
        }

        if (! resource) {
            return false;
        }

        return ! resource.__namespace;
    }

    /**
     * @inheritdoc
     */
    set resolver(resolver) {
    }

    /**
     * @inheritdoc
     */
    get resolver() {
        return null;
    }

    /**
     * Gets the default route name for a class method.
     *
     * @param {ReflectionClass} reflectionClass
     * @param {ReflectionMethod} method
     *
     * @returns {string}
     *
     * @protected
     */
    _getDefaultRouteName(reflectionClass, method) {
        let name = (reflectionClass.name.replace(/[\\.]/g, '_') + '_' + method.name).toLowerCase();
        if (0 < this._defaultRouteIndex) {
            name += '_' + this._defaultRouteIndex;
        }

        ++this._defaultRouteIndex;

        return name;
    }

    /**
     * @param {ReflectionClass} reflectionClass
     *
     * @protected
     */
    _getGlobals(reflectionClass) {
        const globals = this._resetGlobals();
        /** @type {[Function, Route[]]} */
        const annotEntry = reflectionClass.metadata.find(([ annotationClass ]) => annotationClass === Route);

        if (! annotEntry) {
            return globals;
        }

        const annotations = isArray(annotEntry[1]) ? annotEntry[1] : [ annotEntry[1] ];
        for (const annot of annotations) {
            if (undefined !== annot.name) {
                globals.name = annot.name;
            }

            if (undefined !== annot.path) {
                globals.path = annot.path;
            }

            globals.localizedPaths = annot.localizedPaths;

            if (undefined !== annot.requirements) {
                globals.requirements = annot.requirements;
            }

            if (undefined !== annot.options) {
                globals.options = annot.options;
            }

            if (undefined !== annot.defaults) {
                globals.defaults = annot.defaults;
            }

            if (undefined !== annot.schemes) {
                globals.schemes = annot.schemes;
            }

            if (undefined !== annot.methods) {
                globals.methods = annot.methods;
            }

            if (undefined !== annot.host) {
                globals.host = annot.host;
            }

            if (undefined !== annot.condition) {
                globals.condition = annot.condition;
            }
        }

        return globals;
    }

    /**
     * Gets an empty globals object.
     *
     * @returns {Object.<string, *>}
     *
     * @private
     */
    _resetGlobals() {
        return {
            path: '',
            localizedPaths: {},
            requirements: {},
            options: {},
            defaults: {},
            schemes: [],
            methods: [],
            host: '',
            condition: '',
            name: '',
        };
    }

    /**
     * Creates a Route object.
     *
     * @param {string} path
     * @param {Object.<string, *>} defaults
     * @param {Object.<string, string>} requirements
     * @param {Object.<string, *>} options
     * @param {string} host
     * @param {string[]} schemes
     * @param {string[]} methods
     * @param {string} condition
     *
     * @returns {Jymfony.Component.Routing.Route}
     *
     * @protected
     */
    _createRoute(path, defaults, requirements, options, host, schemes, methods, condition) {
        return new RoutingRoute(path, defaults, requirements, options, host, schemes, methods, condition);
    }

    /**
     * @param {Jymfony.Component.Routing.Route} route
     * @param {ReflectionClass} reflectionClass
     * @param {ReflectionMethod} method
     * @param {Route} annot
     *
     * @abstract
     * @protected
     */
    _configureRoute(route, reflectionClass, method, annot) { // eslint-disable-line no-unused-vars
        throw new Error('_configureRoute method should be implemented.');
    }
}
