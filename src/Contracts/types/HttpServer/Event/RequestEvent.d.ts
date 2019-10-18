declare namespace Jymfony.Contracts.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;

    export class RequestEvent extends HttpEvent {
        private _response?: Response;

        /**
         * Constructor.
         */
        __construct(server: HttpServerInterface, request: Request): void;
        constructor(server: HttpServerInterface, request: Request);

        /**
         * Checks whether a Response is set on the event.
         */
        hasResponse(): boolean;

        /**
         * Gets/sets the current response.
         */
        public response: Response;
    }
}
