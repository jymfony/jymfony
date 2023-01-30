const RuntimeException = Jymfony.Component.Messenger.Exception.RuntimeException;

/**
 * When handling queued messages from {@link DispatchAfterCurrentBusMiddleware},
 * some handlers caused an exception. This exception contains all those handler exceptions.
 *
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class DelayedMessageHandlingException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {Error[]} exceptions
     */
    __construct(exceptions) {
        const exceptionMessages = exceptions.map(e => __jymfony.sprintf('%s: %s', ReflectionClass.getClassName(e), e.message)).join(', \n');

        const message = (() => {
            if (1 === exceptions.length) {
                return __jymfony.sprintf('A delayed message handler threw an exception: \n\n%s', exceptionMessages);
            }

            return __jymfony.sprintf('Some delayed message handlers threw an exception: \n\n%s', exceptionMessages);
        })();

        /**
         * @type {Error[]}
         *
         * @private
         */
        this._exceptions = exceptions;

        super.__construct(message, 0, exceptions[0]);
    }

    /**
     * @returns {Error[]}
     */
    get exceptions() {
        return this._exceptions;
    }
}
