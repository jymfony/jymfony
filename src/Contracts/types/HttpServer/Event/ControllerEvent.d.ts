declare namespace Jymfony.Contracts.HttpServer.Event {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    /**
     * Allows filtering of a controller callable.
     *
     * You can use the controller property to retrieve the current controller.
     * You can set a new controller that is used in the processing
     * of the request.
     *
     * Controllers should be functions.
     */
    export class ControllerEvent extends HttpEvent {
        private _controller: Invokable<any>;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, controller: Invokable<any>, request: RequestInterface): void;
        constructor(server: HttpServerInterface, controller: Invokable<any>, request: RequestInterface);

        /**
         * Gets/sets the current controller.
         */
        public controller: Invokable<any>;
    }
}
