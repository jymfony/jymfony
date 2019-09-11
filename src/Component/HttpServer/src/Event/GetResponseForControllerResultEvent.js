const GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;

/**
 * @memberOf Jymfony.Component.HttpServer.Event
 */
export default class GetResponseForControllerResultEvent extends GetResponseEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpServer.HttpServer} server
     * @param {Jymfony.Component.HttpFoundation.Request} request
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
