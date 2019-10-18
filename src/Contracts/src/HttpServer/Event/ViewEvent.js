const RequestEvent = Jymfony.Contracts.HttpServer.Event.RequestEvent;

/**
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class ViewEvent extends RequestEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpServer.HttpServerInterface} server
     * @param {Jymfony.Contracts.HttpFoundation.RequestInterface} request
     * @param {*} controllerResult
     */
    __construct(server, request, controllerResult) {
        /**
         * @type {*}
         *
         * @private
         */
        this._controllerResult = controllerResult;

        super.__construct(server, request);
    }

    /**
     * The controller return value.
     *
     * @returns {*}
     */
    get controllerResult() {
        return this._controllerResult;
    }
}
