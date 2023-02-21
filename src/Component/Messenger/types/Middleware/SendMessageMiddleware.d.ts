declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import LoggerAwareTrait = Jymfony.Contracts.Logger.LoggerAwareTrait;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
    import SendersLocatorInterface = Jymfony.Component.Messenger.Transport.Sender.SendersLocatorInterface;

    /**
     * @memberOf Jymfony.Component.Messenger.Middleware
     */
    export class SendMessageMiddleware extends implementationOf(MiddlewareInterface, LoggerAwareTrait) {
        private _sendersLocator: SendersLocatorInterface;
        private _eventDispatcher: EventDispatcherInterface;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(sendersLocator: SendersLocatorInterface, eventDispatcher?: EventDispatcherInterface): void;
        constructor(sendersLocator: SendersLocatorInterface, eventDispatcher?: EventDispatcherInterface);

        /**
         * @inheritdoc
         */
        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope>;
    }
}
