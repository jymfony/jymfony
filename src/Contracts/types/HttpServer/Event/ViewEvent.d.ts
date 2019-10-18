declare namespace Jymfony.Contracts.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;

    export class ViewEvent extends RequestEvent {
        private _controllerResult: any;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, request: Request, controllerResult: any): void;
        constructor(server: HttpServerInterface, request: Request, controllerResult: any);

        /**
         * The controller return value.
         */
        public readonly controllerResult: any;
    }
}
