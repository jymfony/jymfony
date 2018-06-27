const HttpEvent = Jymfony.Component.HttpServer.Event.HttpEvent;

/**
 * Allows to execute logic after a response was sent.
 *
 * @memberOf Jymfony.Component.HttpServer.Event
 */
class PostResponseEvent extends HttpEvent {
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
     * Returns the response for which this event was thrown.
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     */
    get response() {
        return this._response;
    }
}

module.exports = PostResponseEvent;
