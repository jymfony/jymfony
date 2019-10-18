declare namespace Jymfony.Contracts.HttpServer.Event {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;
    import ResponseInterface = Jymfony.Contracts.HttpFoundation.ResponseInterface;

    export class ResponseEvent extends HttpEvent {
        private _response: Response;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, request: RequestInterface, response: ResponseInterface): void;
        constructor(server: HttpServerInterface, request: RequestInterface, response: ResponseInterface);

        /**
         * Gets/sets the current response.
         */
        public response: Response;
    }
}
