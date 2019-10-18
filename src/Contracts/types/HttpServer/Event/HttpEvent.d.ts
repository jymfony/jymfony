declare namespace Jymfony.Contracts.HttpServer.Event {
    import Event = Jymfony.Contracts.EventDispatcher.Event;
    import Request = Jymfony.Component.HttpFoundation.Request;

    export class HttpEvent extends Event {
        private _server: HttpServerInterface;
        private _request: Request;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, request: Request): void;
        constructor(server: HttpServerInterface, request: Request);

        /**
         * Gets the HttpServer instance for this request.
         */
        public readonly server: HttpServerInterface;

        /**
         * Gets the current request.
         */
        public readonly request: Request;
    }
}
