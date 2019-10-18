declare namespace Jymfony.Contracts.HttpServer.Event {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    export class ViewEvent extends RequestEvent {
        private _controllerResult: any;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, request: RequestInterface, controllerResult: any): void;
        constructor(server: HttpServerInterface, request: RequestInterface, controllerResult: any);

        /**
         * The controller return value.
         */
        public readonly controllerResult: any;
    }
}
