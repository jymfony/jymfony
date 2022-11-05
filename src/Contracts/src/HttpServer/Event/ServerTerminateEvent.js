const Event = Jymfony.Contracts.EventDispatcher.Event;

/**
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class ServerTerminateEvent extends Event {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpServer.HttpServerInterface} server
     */
    __construct(server) {
        /**
         * @type {Jymfony.Contracts.HttpServer.HttpServerInterface}
         *
         * @private
         */
        this._server = server;

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
}
