const HttpEvent = Jymfony.Component.HttpServer.Event.HttpEvent;

/**
 * Allows filtering of a controller callable.
 *
 * You can use the controller property to retrieve the current controller.
 * You can set a new controller that is used in the processing
 * of the request.
 *
 * Controllers should be functions.
 *
 * @memberOf Jymfony.Component.HttpServer.Event
 */
class FilterControllerEvent extends HttpEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpServer.HttpServer} server
     * @param {Function} controller
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    __construct(server, controller, request) {
        super.__construct(server, request);

        /**
         * @type {Function}
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
     * Sets the response for the current event.
     *
     * @param {Function} controller
     */
    set controller(controller) {
        this._controller = controller;
    }
}

module.exports = FilterControllerEvent;
