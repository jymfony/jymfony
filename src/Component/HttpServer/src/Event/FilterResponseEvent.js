const HttpEvent = Jymfony.Component.HttpServer.Event.HttpEvent;

/**
 * @memberOf Jymfony.Component.HttpServer.Event
 */
export default class FilterResponseEvent extends HttpEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpServer.HttpServer} server
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
