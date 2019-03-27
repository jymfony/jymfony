declare namespace Jymfony.Component.HttpServer.EventListener {
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import GetResponseForExceptionEvent = Jymfony.Component.HttpServer.Event.GetResponseForExceptionEvent;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;

    export class ExceptionListener extends implementationOf(EventSubscriberInterface) {
        private _controller: Invokable<any> | string;

        private _logger: LoggerInterface;

        private _debug: boolean;

        /**
         * Constructor.
         */
        __construct(controller: Invokable<any> | string, logger?: LoggerInterface | undefined, debug?: boolean): void;
        constructor(controller: Invokable<any> | string, logger?: LoggerInterface | undefined, debug?: boolean);

        /**
         * Gets a response for a given exception.
         */
        onException(event: GetResponseForExceptionEvent, eventName: string, eventDispatcher: EventDispatcherInterface): Promise<void>;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;

        /**
         * Logs an exception.
         */
        protected _logException(exception: Error, message: string): void;

        /**
         * Clones the request for the exception.
         *
         * @param exception The thrown exception
         * @param request The original request
         *
         * @returns The cloned request
         */
        protected _duplicateRequest(exception: Error, request: Request): Request;
    }
}
