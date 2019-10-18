const HttpEvent = Jymfony.Contracts.HttpServer.Event.HttpEvent;

/**
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class ResponseEvent extends HttpEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpServer.HttpServerInterface} server
     * @param {Jymfony.Contracts.HttpFoundation.RequestInterface} request
     * @param {Jymfony.Contracts.HttpFoundation.ResponseInterface} response
     */
    __construct(server, request, response) {
        super.__construct(server, request);

        /**
         * @type {Jymfony.Contracts.HttpFoundation.ResponseInterface}
         *
         * @private
         */
        this._response = response;
    }

    /**
     * Gets the current response.
     *
     * @returns {Jymfony.Contracts.HttpFoundation.ResponseInterface}
     */
    get response() {
        return this._response;
    }

    /**
     * Sets the response for the current event.
     *
     * @param {Jymfony.Contracts.HttpFoundation.ResponseInterface} response
     */
    set response(response) {
        this._response = response;
    }
}
