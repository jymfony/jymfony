const RuntimeException = Jymfony.Component.Messenger.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class HandlerFailedException extends RuntimeException {
    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {Error[]} exceptions
     */
    __construct(envelope, exceptions) {
        const firstFailure = exceptions[0];
        const message = __jymfony.sprintf('Handling "%s" failed: ', ReflectionClass.getClassName(envelope.message));

        super.__construct(
            message + (1 === exceptions.length
                ? firstFailure.message
                : __jymfony.sprintf('%d handlers failed. First failure is: %s', exceptions.length, firstFailure.message)
            ),
            firstFailure.code || null,
            firstFailure
        );

        /**
         * @type {Jymfony.Component.Messenger.Envelope}
         *
         * @private
         */
        this._envelope = envelope;

        /**
         * @type {Error[]}
         *
         * @private
         */
        this._exceptions = exceptions;
    }

    /**
     * @return {Jymfony.Component.Messenger.Envelope}
     */
    get envelope() {
        return this._envelope;
    }

    /**
     * @returns {Error[]}
     */
    get nestedExceptions() {
        return this._exceptions;
    }

    /**
     * @param {string} exceptionClassName
     *
     * @returns {Error[]}
     */
    getNestedExceptionOfClass(exceptionClassName) {
        return this._exceptions.filter(e => new ReflectionClass(e).isInstanceOf(exceptionClassName));
    }
}
