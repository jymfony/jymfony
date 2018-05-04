const GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;

/**
 * @memberOf Jymfony.Component.HttpServer.Event
 */
class GetResponseForExceptionEvent extends GetResponseEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpServer.HttpServer} server
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Error} e
     *
     * @inheritdoc
     */
    __construct(server, request, e) {
        /**
         * @type {Error}
         *
         * @private
         */
        this._exception = e;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._allowCustomResponseCode = false;

        super.__construct(server, request);
    }

    /**
     * Returns the thrown exception.
     *
     * @returns {Error} The thrown exception
     */
    get exception() {
        return this._exception;
    }

    /**
     * Replaces the thrown exception.
     *
     * This exception will be thrown if no response is set in the event.
     *
     * @param {Error} exception The thrown exception
     */
    set exception(exception) {
        this._exception = exception;
    }

    /**
     * Mark the event as allowing a custom response code.
     */
    allowCustomResponseCode() {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._allowCustomResponseCode = true;
    }

    /**
     * Returns true if the event allows a custom response code.
     *
     * @returns {boolean}
     */
    get isAllowingCustomResponseCode() {
        return this._allowCustomResponseCode;
    }
}

module.exports = GetResponseForExceptionEvent;
