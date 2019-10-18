const HttpEvent = Jymfony.Contracts.HttpServer.Event.HttpEvent;

/**
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class ResponseEvent extends HttpEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpServer.HttpServerInterface} server
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Jymfony.Component.HttpFoundation.Response} response
     */
    __construct(server, request, response) {
        super.__construct(server, request);

        /**
         * @type {Jymfony.Component.HttpFoundation.Response}
         *
         * @private
         */
        this._response = response;
    }

    /**
     * Gets the current response.
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     */
    get response() {
        return this._response;
    }

    /**
     * Sets the response for the current event.
     *
     * @param {Jymfony.Component.HttpFoundation.Response} response
     */
    set response(response) {
        this._response = response;
    }
}
