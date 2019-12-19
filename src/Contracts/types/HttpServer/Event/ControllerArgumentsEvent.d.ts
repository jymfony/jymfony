declare namespace Jymfony.Contracts.HttpServer.Event {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    export class ControllerArgumentsEvent extends ControllerEvent {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, controller: Invokable<any>, args: any[], request: RequestInterface): void;
        constructor(server: HttpServerInterface, controller: Invokable<any>, args: any[], request: RequestInterface);

        public args: any[];
    }
}
