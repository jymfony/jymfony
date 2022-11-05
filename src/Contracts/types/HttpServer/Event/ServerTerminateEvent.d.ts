declare namespace Jymfony.Contracts.HttpServer.Event {
    import Event = Jymfony.Contracts.EventDispatcher.Event;

    /**
     * @memberOf Jymfony.Contracts.HttpServer.Event
     */
    export class ServerTerminateEvent extends Event {
        private _server: HttpServerInterface;

        /**
         * Constructor.
         */
        __construct(server: HttpServerInterface): void;
        constructor(server: HttpServerInterface);

        /**
         * Gets the HttpServer instance for this request.
         */
        public readonly server: HttpServerInterface;
    }
}
