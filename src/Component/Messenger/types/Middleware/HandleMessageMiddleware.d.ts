declare namespace Jymfony.Component.Messenger.Middleware {
    import Acknowledger = Jymfony.Component.Messenger.Handler.Acknowledger;
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;
    import HandlerArgumentsStamp = Jymfony.Component.Messenger.Stamp.HandlerArgumentsStamp;
    import HandlersLocatorInterface = Jymfony.Component.Messenger.Handler.HandlersLocatorInterface;
    import LoggerAwareTrait = Jymfony.Contracts.Logger.LoggerAwareTrait;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;

    export class HandleMessageMiddleware extends implementationOf(MiddlewareInterface, LoggerAwareTrait) {
        private _handlersLocator: HandlersLocatorInterface;
        private _allowNoHandlers: boolean;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(handlersLocator: HandlersLocatorInterface, allowNoHandlers?: boolean): void
        constructor(handlersLocator: HandlersLocatorInterface, allowNoHandlers?: boolean);

        /**
         * {@inheritdoc}
         *
         * @throws {Jymfony.Component.Messenger.Exception.NoHandlerForMessageException} When no handler is found and allowNoHandlers is false
         */
        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope>;

        private _messageHasAlreadyBeenHandled(envelope: Envelope, handlerDescriptor: HandlerDescriptor): boolean;

        private _callHandler(handler: (message: object, ack?: Acknowledger) => Promise<any>, message: object, ack: Acknowledger | null, handlerArgumentsStamp: HandlerArgumentsStamp | null): Promise<any>;
    }
}
