declare namespace Jymfony.Component.HttpServer.Event {
    import Event = Jymfony.Component.EventDispatcher.Event;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import HttpServer = Jymfony.Component.HttpServer.HttpServer;

    export class HttpEvent extends Event {
        private _server: HttpServer;
        private _request: Request;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServer, request: Request): void;
        constructor(server: HttpServer, request: Request);

        /**
         * Gets the HttpServer instance for this request.
         */
        public readonly server: HttpServer;

        /**
         * Gets the current request.
         */
        public readonly request: Request;
    }
}
