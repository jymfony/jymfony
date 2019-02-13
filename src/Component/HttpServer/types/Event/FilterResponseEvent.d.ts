declare namespace Jymfony.Component.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;
    import HttpServer = Jymfony.Component.HttpServer.HttpServer;

    export class FilterResponseEvent extends HttpEvent {
        private _response: Response;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServer, request: Request, response: Response): void;
        constructor(server: HttpServer, request: Request, response: Response);

        /**
         * Gets/sets the current response.
         */
        public response: Response;
    }
}
