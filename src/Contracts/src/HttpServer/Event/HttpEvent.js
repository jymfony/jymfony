const Event = Jymfony.Contracts.EventDispatcher.Event;

/**
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class HttpEvent extends Event {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpServer.HttpServerInterface} server
     * @param {Jymfony.Contracts.HttpFoundation.RequestInterface} request
     */
    __construct(server, request) {
        /**
         * @type {Jymfony.Contracts.HttpServer.HttpServerInterface}
         *
         * @private
         */
        this._server = server;

        /**
         * @type {Jymfony.Contracts.HttpFoundation.RequestInterface}
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
     * @returns {Jymfony.Contracts.HttpFoundation.RequestInterface}
     */
    get request() {
        return this._request;
    }
}
