declare namespace Jymfony.Contracts.HttpServer.Event {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;
    import ResponseInterface = Jymfony.Contracts.HttpFoundation.ResponseInterface;

    /**
     * Allows to execute logic after a response was sent.
     */
    export class PostResponseEvent extends HttpEvent {
        private _response: ResponseInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, request: RequestInterface, response: ResponseInterface): void;
        constructor(server: HttpServerInterface, request: RequestInterface, response: ResponseInterface);

        /**
         * Returns the response for which this event was thrown.
         */
        public readonly response: ResponseInterface;
    }
}
