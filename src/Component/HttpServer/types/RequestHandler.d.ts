declare namespace Jymfony.Component.HttpServer {
    import LoggerAwareInterface = Jymfony.Contracts.Logger.LoggerAwareInterface;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import ControllerResolverInterface = Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import ContentType = Jymfony.Component.HttpFoundation.Header.ContentType;
    import ArgumentResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentResolverInterface;

    /**
     * A Request handler.
     * Should be extended from servers/request handlers.
     */
    export class RequestHandler extends implementationOf(LoggerAwareInterface) {
        protected _dispatcher: EventDispatcherInterface;
        protected _resolver: ControllerResolverInterface;
        protected _logger: LoggerInterface;
        private _requestTimeoutMs: number;
        private _argumentResolver: ArgumentResolverInterface;

        /**
         * Constructor.
         */
        __construct(dispatcher: EventDispatcherInterface, resolver: ControllerResolverInterface, argumentResolver: ArgumentResolverInterface): void;
        constructor(dispatcher: EventDispatcherInterface, resolver: ControllerResolverInterface, argumentResolver: ArgumentResolverInterface);

        /**
         * Gets the current event dispatcher.
         */
        public readonly eventDispatcher: EventDispatcherInterface;

        /**
         * Sets the request timeout.
         */
        public /* writeonly */ requestTimeoutMs: number;

        /**
         * Sets the logger for the current http server.
         */
        setLogger(logger: LoggerInterface): void;

        /**
         * Handles a Request to convert it to a Response.
         *
         * When catchExceptions is true, catches all exceptions
         * and do its best to convert them to a Response instance.
         *
         * @param request A Request instance
         * @param [catchExceptions = true] Whether to catch exceptions or not
         *
         * @returns A Response instance
         *
         * @throws {Exception} When an Exception occurs during processing
         */
        handle(request: Request, catchExceptions?: boolean): Promise<Response>;

        /**
         * Get the public scheme for this server (http/https)
         */
        public readonly scheme: string;

        /**
         * Parse request content.
         *
         * @returns An array composed by the request params object and the content as Buffer
         */
        protected _parseRequestContent(stream: NodeJS.ReadableStream, headers: Record<string, string>, contentType: ContentType): Promise<[any, Buffer | undefined]>;

        /**
         * Dispatches request through the event dispatcher to obtain a valid response.
         */
        protected _handleRaw(request: Request): Promise<Response>;

        /**
         * Handles an exception by trying to convert it to a Response.
         */
        protected _handleException(e: Error, request: Request): Promise<Response>;

        /**
         * Gets the request scheme.
         */
        protected _getScheme(headers: Record<string, any>): string;

        /**
         * Filters a response object.
         */
        private _filterResponse(response: Response, request: Request): Promise<Response>;
    }
}
