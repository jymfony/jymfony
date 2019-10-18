declare namespace Jymfony.Contracts.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;

    /**
     * Allows to execute logic after a response was sent.
     */
    export class PostResponseEvent extends HttpEvent {
        private _response: Response;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, request: Request, response: Response): void;
        constructor(server: HttpServerInterface, request: Request, response: Response);

        /**
         * Returns the response for which this event was thrown.
         */
        public readonly response: Response;
    }
}
