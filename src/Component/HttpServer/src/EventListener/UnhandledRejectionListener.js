const ClsTrait = Jymfony.Contracts.Async.ClsTrait;
const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const UnhandledRejectionException = Jymfony.Component.HttpServer.Exception.UnhandledRejectionException;

/**
 * @memberOf Jymfony.Component.HttpServer.EventListener
 */
export default class UnhandledRejectionListener extends implementationOf(EventSubscriberInterface, ClsTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger]
     * @param {boolean} [debug = false]
     */
    __construct(logger = undefined, debug = false) {
        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {boolean}
         *
         * @private
         */
        this._debug = debug;
    }

    /**
     * Gets a response for a given exception.
     *
     * @param {Jymfony.Contracts.HttpServer.Event.ExceptionEvent} event
     *
     * @returns {Promise<void>}
     */
    async onUnhandledRejection(event) {
        const request = this._activeContext[ClsTrait.REQUEST_SYMBOL];
        if (! request) {
            return;
        }

        const abort = request.attributes.get('_abort');
        if (! abort || ! isFunction(abort)) {
            return;
        }

        abort(new UnhandledRejectionException(event.reason));
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            'Jymfony.Contracts.Kernel.Event.UnhandledRejectionEvent': [ 'onUnhandledRejection', -128 ],
        };
    }
}
