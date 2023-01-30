/**
 * Describes a handler and the possible associated options, such as `from_transport`, `bus`, etc.
 *
 * @memberOf Jymfony.Component.Messenger.Handler
 * @final
 */
export default class HandlerDescriptor {
    /**
     * Constructor.
     *
     * @param {function(*, Jymfony.Component.Messenger.Handler.Acknowledger?): Promise<void>} handler
     * @param {*} [options = {}]
     */
    __construct(handler, options = {}) {
        /**
         * @type {function(*, Jymfony.Component.Messenger.Handler.Acknowledger?): Promise<void>}
         *
         * @private
         */
        this._handler = handler;

        /**
         * @type {Jymfony.Component.Messenger.Handler.BatchHandlerInterface | null}
         * @private
         */
        this._batchHandler = null;

        /**
         * @type {*}
         *
         * @private
         */
        this._options = options;

        debugger;
        dd(this._handler.name);

        /**
         * @type {string}
         *
         * @private
         */
        this._name = '';
        // const r = new ReflectionFunction(handler);
        //
        // if (str_contains($r->name, '{closure}')) {
        //     $this->name = 'Closure';
        // } elseif (!$handler = $r->getClosureThis()) {
        //     $class = $r->getClosureScopeClass();
        //
        //     $this->name = ($class ? $class->name.'::' : '').$r->name;
        // } else {
        //     if ($handler instanceof BatchHandlerInterface) {
        //         $this->batchHandler = $handler;
        //     }
        //
        //     $this->name = \get_class($handler).'::'.$r->name;
        // }
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
