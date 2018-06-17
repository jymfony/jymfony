const Event = Jymfony.Component.EventDispatcher.Event;

/**
 * @memberOf Jymfony.Component.HttpServer.Event
 */
class HttpEvent extends Event {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpServer.HttpServer} server
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    __construct(server, request) {
        /**
         * @type {Jymfony.Component.HttpServer.HttpServer}
         *
         * @private
         */
        this._server = server;

        /**
         * @type {Jymfony.Component.HttpFoundation.Request}
         *
         * @private
         */
        this._request = request;

        super.__construct();
    }

    /**
     * Gets the HttpServer instance for this request.
     *
     * @returns {Jymfony.Component.HttpServer.HttpServer}
     */
    get server() {
        return this._server;
    }

    /**
     * Gets the current request.
     *
     * @returns {Jymfony.Component.HttpFoundation.Request}
     */
    get request() {
        return this._request;
    }
}

module.exports = HttpEvent;
