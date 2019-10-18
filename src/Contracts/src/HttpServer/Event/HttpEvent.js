const Event = Jymfony.Contracts.EventDispatcher.Event;

/**
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class HttpEvent extends Event {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpServer.HttpServerInterface} server
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    __construct(server, request) {
        /**
         * @type {Jymfony.Contracts.HttpServer.HttpServerInterface}
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
     * @returns {Jymfony.Contracts.HttpServer.HttpServerInterface}
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
