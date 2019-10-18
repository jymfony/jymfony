const HttpEvent = Jymfony.Contracts.HttpServer.Event.HttpEvent;

/**
 * Allows to execute logic after a response was sent.
 *
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class PostResponseEvent extends HttpEvent {
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
     * Returns the response for which this event was thrown.
     *
     * @returns {Jymfony.Contracts.HttpFoundation.ResponseInterface}
     */
    get response() {
        return this._response;
    }
}
