declare namespace Jymfony.Component.HttpServer {
    import EventDispatcherInterface = Jymfony.Component.EventDispatcher.EventDispatcherInterface;
    import ControllerResolverInterface = Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;

    interface ListenOptions {
        port?: number;
        host?: string;
        path?: string;
    }

    export class HttpServer extends RequestHandler {
        protected _http: any;

        protected _host?: string | undefined;

        protected _port?: string | undefined;

        /**
         * Constructor.
         */
        __construct(dispatcher: EventDispatcherInterface, resolver: ControllerResolverInterface): void;
        constructor(dispatcher: EventDispatcherInterface, resolver: ControllerResolverInterface);

        /**
         * Creates a new Http server instance.
         */
        static create(routes: RouteCollection, logger?: LoggerInterface): HttpServer;

        /**
         * Listen and handle connections.
         */
        listen(opts?: ListenOptions): Promise<void>;

        /**
         * Closes the server.
         */
        close(): Promise<void>;

        /**
         * Creates a new http server.
         */
        protected _createServer(): any;

        /**
         * Converts an IncomingMessage to an HttpFoundation request
         * and sends it to the Kernel.
         */
        protected _handleRequest(req: any, res: any): Promise<void>;

        /**
         * Handles an incoming request from the http server.
         */
        protected _incomingRequest(req: any, res: any): Promise<void>;
    }
}
