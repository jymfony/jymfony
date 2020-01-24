const ControllerEvent = Jymfony.Contracts.HttpServer.Event.ControllerEvent;

export default class ControllerArgumentsEvent extends ControllerEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpServer.HttpServerInterface} server
     * @param {Function} controller
     * @param {*[]} args
     * @param {Jymfony.Contracts.HttpFoundation.RequestInterface} request
     */
    __construct(server, controller, args, request) {
        super.__construct(server, controller, request);

        this._arguments = args;
    }

    get args() {
        return [ ...this._arguments ];
    }

    set args(args) {
        this._arguments = [ ...args ];
    }
}
