declare namespace Jymfony.Contracts.HttpServer.Event {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    export class ExceptionEvent extends RequestEvent {
        private _exception: Error;
        private _allowCustomResponseCode: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServerInterface, request: RequestInterface, e: Error): void;
        constructor(server: HttpServerInterface, request: RequestInterface, e: Error);

        /**
         * Gets/sets the thrown exception.
         * This exception will be thrown if no response is set in the event.
         *
         * @returns The thrown exception
         */
        public exception: Error;

        /**
         * Mark the event as allowing a custom response code.
         */
        allowCustomResponseCode(): void;

        /**
         * Returns true if the event allows a custom response code.
         */
        public readonly isAllowingCustomResponseCode: boolean;
    }
}
