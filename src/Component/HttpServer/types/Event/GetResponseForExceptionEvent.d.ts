declare namespace Jymfony.Component.HttpServer.Event {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import HttpServer = Jymfony.Component.HttpServer.HttpServer;

    export class GetResponseForExceptionEvent extends GetResponseEvent {
        private _exception: Error;
        private _allowCustomResponseCode: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServer, request: Request, e: Error): void;
        constructor(server: HttpServer, request: Request, e: Error);

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
