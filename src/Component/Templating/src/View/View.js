const RequestAwareInterface = Jymfony.Component.Templating.Helper.RequestAwareInterface;
const ResponseAwareInterface = Jymfony.Component.Templating.Helper.ResponseAwareInterface;
const SlotsHelper = Jymfony.Component.Templating.Helper.SlotsHelper;

const promisify = require('util').promisify;
const streamOut = promisify(require('stream').Writable.prototype.write);

/**
 * @memberOf Jymfony.Component.Templating.View
 */
class View {
    /**
     * Constructor.
     *
     * @param {module:stream.Writable} output
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name
     * @param {Jymfony.Component.Templating.Engine.JsEngine} engine
     * @param {Object.<string, *>} parameters
     */
    __construct(output, name, engine, parameters = {}) {
        /**
         * @type {module:stream.Writable}
         *
         * @private
         */
        this._output = output;

        /**
         * @type {string|Jymfony.Component.Templating.TemplateReferenceInterface}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {Jymfony.Component.Templating.Engine.JsEngine}
         *
         * @private
         */
        this._engine = engine;

        /**
         * @type {Object<string, *>}
         *
         * @private
         */
        this._parameters = Object.assign({}, parameters, {
            view: new Proxy(this, {
                get: (target, p, receiver) => {
                    if (! Reflect.has(target, p)) {
                        return this.getHelper(p);
                    }

                    return Reflect.get(target, p, receiver);
                },
                has: (target, p) => {
                    return Reflect.has(target, p) || undefined !== this._helpers[p];
                },
            }),
        });

        /**
         * @type {Object<string, Jymfony.Component.Templating.Helper.HelperInterface>}
         *
         * @private
         */
        this._helpers = engine.helpers;
        this._helpers.slots = new SlotsHelper(this);

        /**
         * @type {Object<string, Function>}
         *
         * @private
         */
        this._escapers = engine.escapers;

        /**
         * @type {Object.<string, __jymfony.StreamBuffer>}
         *
         * @private
         */
        this._slots = {};

        /**
         * @type {string}
         *
         * @private
         */
        this._currentSlot = undefined;

        /**
         * @type {undefined|string}
         *
         * @private
         */
        this._parent = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._emitted = false;

        /**
         * @type {Object.<string, Object.<string, string>>}
         *
         * @private
         */
        this._escaperCache = {};
        for (const context of Object.keys(this._escapers)) {
            this._escaperCache[context] = {};
        }
    }

    /**
     * Gets an helper.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.Templating.Helper.HelperInterface}
     */
    getHelper(name) {
        if (undefined === this._helpers[name]) {
            throw new InvalidArgumentException(__jymfony.sprintf('The helper "%s" is not defined.', name));
        }

        let helper = this._helpers[name];
        if (undefined !== this._parameters._request && helper instanceof RequestAwareInterface) {
            helper = helper.withRequest(this._parameters._request);
        }
        if (undefined !== this._parameters._response && helper instanceof ResponseAwareInterface) {
            helper = helper.withResponse(this._parameters._response);
        }

        return helper;
    }

    /**
     * Escapes a string.
     *
     * @param {*} value A variable to escape
     * @param {string} context The context name
     *
     * @returns {string} The escaped value
     */
    escape(value, context = 'html') {
        if (! isString(value)) {
            return value;
        }

        if (undefined !== this._escaperCache[context][value]) {
            return this._escaperCache[context][value];
        }

        return this._escaperCache[context][value] = this.getEscaper(context)(value);
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
     * Streams the view to the client.
     *
     * @returns {Promise<*>}
     */
    stream() {
        return this._doStream(this._name);
    }

    /**
     * Extends another template.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name
     *
     * @returns {Promise<*>}
     */
    async extend(name) {
        if (undefined !== this._currentSlot) {
            throw new LogicException('Cannot extend a template from inside a slot.');
        }

        if (this._emitted) {
            throw new LogicException('Output already called, extend cannot be called.');
        }

        this._parent = name;
    }

    /**
     * Do the stream operation.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _doStream(name) {
        const template = await this._engine.load(name);
        await template.stream(this._out.bind(this), this._parameters);

        if (undefined !== this._parent) {
            const parentView = new __self(this._output, this._parent, this._engine, this._parameters);
            parentView._slots = this._slots;
            await parentView.stream();
        }
    }

    /**
     * Outputs the value.
     *
     * @param {string|Buffer} buffer
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    _out(buffer) {
        if (undefined === this._currentSlot) {
            if (undefined !== this._parent) {
                throw new LogicException('Child template cannot print anything outside a slot.');
            }

            this._emitted = true;
            return streamOut.call(this._output, buffer);
        }

        return streamOut.call(this._slots[this._currentSlot], buffer);
    }
}

module.exports = View;
