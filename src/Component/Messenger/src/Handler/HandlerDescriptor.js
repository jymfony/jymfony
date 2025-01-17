const BatchHandlerInterface = Jymfony.Component.Messenger.Handler.BatchHandlerInterface;

/**
 * Describes a handler and the possible associated options, such as `from_transport`, `bus`, etc.
 *
 * @memberOf Jymfony.Component.Messenger.Handler
 * @final
 */
export default class HandlerDescriptor {
    /**
     * @type {function(*, Jymfony.Component.Messenger.Handler.Acknowledger?): Promise<void>}
     *
     * @private
     */
    _handler;

    /**
     * @type {Jymfony.Component.Messenger.Handler.BatchHandlerInterface | null}
     *
     * @private
     */
    _batchHandler;

    /**
     * @type {*}
     *
     * @private
     */
    _options;

    /**
     * @type {string}
     *
     * @private
     */
    _name;

    /**
     * Constructor.
     *
     * @param {function(*, Jymfony.Component.Messenger.Handler.Acknowledger?): Promise<void>} handler
     * @param {*} [options = {}]
     */
    __construct(handler, options = {}) {
        this._handler = handler;
        this._batchHandler = handler instanceof BatchHandlerInterface ? handler : null;
        this._options = options;
        this._name = ReflectionClass.getClassName(this._handler);
        if ('_reflectionClass_surrogateCtor_' === this._name || '_jymfony_testing_doubler_double__' === this._name) {
            const reflClass = new ReflectionClass(this._handler);
            this._name = reflClass.getParentClass().name;
        }

        if (this._name.startsWith('_anonymous_xΞ')) {
            this._name = 'Closure';
        } else if (this._name.startsWith('bound ')) {
            this._name = this._name.substring(6) || 'Closure';
        } else if ('innerObject' in this._handler && this._handler.innerObject instanceof BoundFunction) {
            const { innerObject } = this._handler;
            this._name = ReflectionClass.getClassName(innerObject.getObject()) + '#' + this._handler.name;
        } else if ('__invoke' in this._handler) {
            this._name += '#__invoke';
        } else if ('' === this._name || 'Object' === this._name) {
            this._name = 'Closure';
        }
    }

    /**
     * @returns {function(*, Jymfony.Component.Messenger.Handler.Acknowledger?): Promise<void>}
     */
    get handler() {
        return this._handler;
    }

    /**
     * @returns {string}
     */
    get name() {
        let name = this._name;
        const alias = this._options.alias || null;

        if (null !== alias) {
            name += '@' + alias;
        }

        return name;
    }

    /**
     * @returns {Jymfony.Component.Messenger.Handler.BatchHandlerInterface | null}
     */
    get batchHandler() {
        return this._batchHandler;
    }

    /**
     * @param {string} option
     *
     * @returns {*}
     */
    getOption(option) {
        return this._options[option] || null;
    }
}
