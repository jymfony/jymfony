const HttpEvent = Jymfony.Contracts.HttpServer.Event.HttpEvent;

/**
 * Allows filtering of a controller callable.
 *
 * You can use the controller property to retrieve the current controller.
 * You can set a new controller that is used in the processing
 * of the request.
 *
 * Controllers should be functions.
 *
 * @memberOf Jymfony.Contracts.HttpServer.Event
 */
export default class ControllerEvent extends HttpEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpServer.HttpServerInterface} server
     * @param {Function} controller
     * @param {Jymfony.Contracts.HttpFoundation.RequestInterface} request
     */
    __construct(server, controller, request) {
        super.__construct(server, request);

        /**
         * @type {Function}
         *
         * @private
         */
        this._controller = controller;
    }

    /**
     * Gets the current controller.
     *
     * @returns {Function}
     */
    get controller() {
        return this._controller;
    }

    /**
     * Sets the controller for the current event.
     *
     * @param {Function} controller
     */
    set controller(controller) {
        this._controller = controller;
    }
}
