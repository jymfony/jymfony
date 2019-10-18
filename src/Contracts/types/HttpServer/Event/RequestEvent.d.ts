declare namespace Jymfony.Contracts.HttpServer.Event {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;
    import ResponseInterface = Jymfony.Contracts.HttpFoundation.ResponseInterface;

    export class RequestEvent extends HttpEvent {
        private _response?: ResponseInterface;

        /**
         * Constructor.
         */
        __construct(server: HttpServerInterface, request: RequestInterface): void;
        constructor(server: HttpServerInterface, request: RequestInterface);

        /**
         * Checks whether a Response is set on the event.
         */
        hasResponse(): boolean;

        /**
         * Gets/sets the current response.
         */
        public response: ResponseInterface;
    }
}
