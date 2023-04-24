const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * @memberOf Jymfony.Component.Routing.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_CLASS | Annotation.ANNOTATION_TARGET_METHOD)
class Route {
    /**
     * Route annotation.
     *
     * @param {object} options
     * @param {string | Object.<string, string>} options.path
     * @param {string} [options.name]
     * @param {Object.<string, string>} [options.requirements = {}]
     * @param {Object.<string, string>} [options.options = {}]
     * @param {Object.<string, string>} [options.defaults = {}]
     * @param {string} [options.host]
     * @param {string[]} [options.methods = ['GET', 'POST']]
     * @param {string[]} [options.schemes = ['http', 'https']]
     * @param {string} [options.condition]
     * @param {string} [options.locale]
     * @param {string} [options.format]
     */
    __construct(options) {
        if (isString(options)) {
            options = { path: options };
        }

        const {
            path,
            name,
            requirements,
            routeOptions,
            defaults,
            host,
            methods,
            schemes,
            condition,
            locale,
            format,
        } = options;

        if (isObjectLiteral(path)) {
            this._localizedPaths = path;
        } else {
            this._path = path;
        }

        this._name = name;
        this._requirements = requirements;
        this._options = routeOptions;
        this._defaults = defaults;
        this._host = host;
        this._methods = methods;
        this._schemes = schemes;
        this._condition = condition;

        if (locale) {
            this._defaults = (this._defaults || {});
            this._defaults._locale = locale;
        }

        if (format) {
            this._defaults = (this._defaults || {});
            this._defaults._format = format;
        }
    }

    get path() {
        return this._path;
    }

    get localizedPaths() {
        return this._localizedPaths;
    }

    get name() {
        return this._name;
    }

    get requirements() {
        return this._requirements;
    }

    get options() {
        return this._options;
    }

    get defaults() {
        return this._defaults;
    }

    get host() {
        return this._host;
    }

    get methods() {
        return this._methods;
    }

    get schemes() {
        return this._schemes;
    }

    get condition() {
        return this._condition;
    }
}
