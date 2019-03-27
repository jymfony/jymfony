declare namespace Jymfony.Component.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import HttpServer = Jymfony.Component.HttpServer.HttpServer;

    export class GetResponseForControllerResultEvent extends GetResponseEvent {
        private _controllerResult: any;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServer, request: Request, controllerResult: any): void;
        constructor(server: HttpServer, request: Request, controllerResult: any);

        /**
         * The controller return value.
         */
        public readonly controllerResult: any;
    }
}
