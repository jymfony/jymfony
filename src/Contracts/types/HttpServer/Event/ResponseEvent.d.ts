declare namespace Jymfony.Contracts.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;

    export class ResponseEvent extends HttpEvent {
        private _response: Response;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, request: Request, response: Response): void;
        constructor(server: HttpServerInterface, request: Request, response: Response);

        /**
         * Gets/sets the current response.
         */
        public response: Response;
    }
}
