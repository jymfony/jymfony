declare namespace Jymfony.Component.HttpServer.Http2 {
    import BaseServer = Jymfony.Component.HttpServer.HttpServer;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import ControllerResolverInterface = Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import ArgumentResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentResolverInterface;

    interface ServerOptions {
        allowHTTP1?: boolean,
        enablePush?: boolean,
        enableConnectProtocol?: boolean,
    }

    // @ts-ignore
    export class HttpServer extends BaseServer {
        private _options: ServerOptions;

        /**
         * Constructor.
         */
        __construct(dispatcher: EventDispatcherInterface, resolver: ControllerResolverInterface, argumentResolver: ArgumentResolverInterface, serverOptions?: ServerOptions): void;
        constructor(dispatcher: EventDispatcherInterface, resolver: ControllerResolverInterface, argumentResolver: ArgumentResolverInterface, serverOptions?: ServerOptions);

        /**
         * Creates a new Http server instance.
         */
        static create(routes: RouteCollection, options?: ServerOptions, logger?: LoggerInterface): HttpServer;

        /**
         * @inheritdoc
         */
        public readonly scheme: string;

        /**
         * @inheritdoc
         */
        protected _createServer(): any;

        /**
         * Converts an IncomingMessage to an HttpFoundation request
         * and sends it to the Kernel.
         */
        protected _handleRequest(stream: any, headers: any): Promise<void>;

        /**
         * Gets the request scheme.
         */
        protected _getScheme(headers: Record<string, any>): string;

        /**
         * Handles an incoming request from the http server.
         * This allows http1 compatibility.
         */
        protected _incomingRequest(req: any, res: any): Promise<void>;

        /**
         * Handles an incoming request from the http server.
         */
        private _incomingStream(stream: any, headers: any): Promise<void>;
    }
}
