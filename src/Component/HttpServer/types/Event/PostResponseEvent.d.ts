declare namespace Jymfony.Component.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;
    import HttpServer = Jymfony.Component.HttpServer.HttpServer;

    /**
     * Allows to execute logic after a response was sent.
     */
    export class PostResponseEvent extends HttpEvent {
        private _response: Response;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServer, request: Request, response: Response): void;
        constructor(server: HttpServer, request: Request, response: Response);

        /**
         * Returns the response for which this event was thrown.
         */
        public readonly response: Response;
    }
}
