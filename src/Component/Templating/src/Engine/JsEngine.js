const EngineInterface = Jymfony.Component.Templating.EngineInterface;
const RequestAwareInterface = Jymfony.Component.Templating.Helper.RequestAwareInterface;
const ResponseAwareInterface = Jymfony.Component.Templating.Helper.ResponseAwareInterface;

/**
 * JsEngine is an engine able to render JS templates.
 *
 * @memberOf Jymfony.Component.Templating.Engine
 */
class JsEngine extends implementationOf(EngineInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Templating.TemplateNameParser} parser A TemplateNameParserInterface instance
     * @param {Jymfony.Component.Templating.Loader.LoaderInterface} loader  A loader instance
     * @param {Object.<string, Jymfony.Component.Templating.Helper.HelperInterface>} [helpers = {}] An object containing helper instances
     */
    __construct(parser, loader, helpers = {}) {
        /**
         * @type {Jymfony.Component.Templating.TemplateNameParser}
         *
         * @private
         */
        this._parser = parser;

        /**
         * @type {Jymfony.Component.Templating.Loader.LoaderInterface}
         *
         * @private
         */
        this._loader = loader;

        /**
         * @type {Object<string, Jymfony.Component.Templating.Helper.HelperInterface>}
         *
         * @private
         */
        this._helpers = {};
        this.addHelpers(helpers);

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._globals = {};

        this._escapers = {};
        this._initializeEscapers();
    }

    /**
     * @inheritdoc
     */
    async exists(name) {
        try {
            await this._load(name);
        } catch (e) {
            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    supports(name) {
        const template = this._parser.parse(name);

        return 'js' === template.get('engine');
    }

    /**
     * Adds some helpers.
     *
     * @param {Object.<string, Jymfony.Component.Templating.Helper.HelperInterface>} helpers An object containing helper instances
     */
    addHelpers(helpers) {
        for (const [ alias, helper ] of __jymfony.getEntries(helpers)) {
            this.set(helper, alias);
        }
    }

    /**
     * Sets the helpers.
     *
     * @param {Object.<string, Jymfony.Component.Templating.Helper.HelperInterface>} helpers An object containing helper instances
     */
    setHelpers(helpers) {
        this._helpers = {};
        this.addHelpers(helpers);
    }

    /**
     * Sets a helper.
     *
     * @param {Jymfony.Component.Templating.Helper.HelperInterface} helper The helper instance
     * @param {string} alias  An alias
     */
    set(helper, alias = undefined) {
        this._helpers[helper.name] = helper;
        if (undefined !== alias) {
            this._helpers[alias] = helper;
        }
    }

    /**
     * Gets an helper.
     *
     * @param {string} name
     * @param {Object.<string, *>} parameters
     *
     * @returns {Jymfony.Component.Templating.Helper.HelperInterface}
     */
    getHelper(name, parameters = {}) {
        if (undefined === this._helpers[name]) {
            throw new InvalidArgumentException(__jymfony.sprintf('The helper "%s" is not defined.', name));
        }

        let helper = this._helpers[name];
        if (undefined !== parameters._request && helper instanceof RequestAwareInterface) {
            helper = helper.withRequest(parameters._request);
        }
        if (undefined !== parameters._response && helper instanceof ResponseAwareInterface) {
            helper = helper.withResponse(parameters._response);
        }

        return helper;
    }

    /**
     * Escapes a string by using the current charset.
     *
     * @param {*} value A variable to escape
     * @param {string} context The context name
     *
     * @returns {string} The escaped value
     */
    escape(value, context = 'html') {
        if (isNumber(value)) {
            return value;
        }

        return this.getEscaper(context)(value);
    }

    /**
     * Gets an escaper for a given context.
     *
     * @param {string} context The context name
     *
     * @returns {Function}
     *
     * @throws {InvalidArgumentException}
     */
    getEscaper(context) {
        if (undefined === this._escapers[context]) {
            throw new InvalidArgumentException(__jymfony.sprintf('No registered escaper for context "%s".', context));
        }

        return this._escapers[context];
    }

    /**
     * Initializes the built-in escapers.
     *
     * Each function specifies a way for applying a transformation to a string
     * passed to it. The purpose is for the string to be "escaped" so it is
     * suitable for the format it is being displayed in.
     *
     * For example, the string: "It's required that you enter a username & password.\n"
     * If this were to be displayed as HTML it would be sensible to turn the
     * ampersand into '&amp;' and the apostrophe into '&aps;'. However if it were
     * going to be used as a string in JavaScript to be displayed in an alert box
     * it would be right to leave the string as-is, but c-escape the apostrophe and
     * the new line.
     *
     * For each function there is a define to avoid problems with strings being
     * incorrectly specified.
     *
     * @protected
     */
    _initializeEscapers() {
        this._escapers = {
            /**
             * Escapes some html special chars.
             *
             * @param {string} value The value to escape
             *
             * @returns {string} the escaped value
             */
            html: (value) => {
                if (!isString(value)) {
                    return value;
                }

                return __jymfony.strtr(value, {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                });
            },

            /**
             * A function that escape all non-alphanumeric characters
             * into their \xHH or \uHHHH representations.
             *
             * @param {string} value The value to escape
             *
             * @returns {string} the escaped value
             */
            js: (value) => {
                if (! isString(value)) {
                    return value;
                }

                const callback = (c) => {
                    const code = c.charCodeAt(0);
                    return 128 > code ? c : '\\x' + code.toString(16);
                };
                return value.replace(/./g, callback);
            },
        };
    }

    /**
     * @inheritDoc
     */
    async render(out, name, parameters = {}) {
        // Attach the global variables
        parameters = Object.assign({}, this._globals, parameters);

        if (parameters.hasOwnProperty('this')) {
            throw new InvalidArgumentException('Invalid parameter (this)');
        }

        if (parameters.hasOwnProperty('view')) {
            throw new InvalidArgumentException('Invalid parameter (view)');
        }

        parameters.view = new Proxy(this, {
            get(target, p, receiver) {
                if (! Reflect.has(target, p)) {
                    return this.getHelper(p, parameters);
                }

                return Reflect.get(target, p, receiver);
            },
            has(target, p) {
                return Reflect.has(target, p) || undefined !== this._helpers[p];
            },
        });

        await (await this._load(name)).stream(out, parameters);
    }

    /**
     * Loads the given template.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name A template name or a TemplateReferenceInterface instance
     *
     * @returns {Promise<Jymfony.Component.Templating.Template.TemplateInterface>}
     *
     * @throws {InvalidArgumentException} if the template cannot be found
     *
     * @protected
     */
    _load(name) {
        return this._loader.load(this._parser.parse(name));
    }
}

module.exports = JsEngine;
