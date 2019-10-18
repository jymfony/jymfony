const HttpEvent = Jymfony.Contracts.HttpServer.Event.HttpEvent;

/**
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class RequestEvent extends HttpEvent {
    __construct(server, request) {
        super.__construct(server, request);

        /**
         * @type {Jymfony.Component.HttpFoundation.Response}
         *
         * @private
         */
        this._response = undefined;
    }

    /**
     * Checks whether a Response is set on the event.
     *
     * @returns {boolean}
     */
    hasResponse() {
        return undefined !== this._response;
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
        this.stopPropagation();
    }
}
