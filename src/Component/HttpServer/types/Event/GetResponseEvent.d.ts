declare namespace Jymfony.Component.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;
    import HttpServer = Jymfony.Component.HttpServer.HttpServer;

    export class GetResponseEvent extends HttpEvent {
        private _response?: Response;

        /**
         * Constructor.
         */
        __construct(server: HttpServer, request: Request): void;
        constructor(server: HttpServer, request: Request);

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
