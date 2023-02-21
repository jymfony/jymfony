declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * @internal
     * @final
     */
    class QueuedEnvelope {
        private _envelope: Envelope;
        private _stack: StackInterface;

        /**
         * Constructor.
         */
        __construct(envelope: Envelope, stack: StackInterface): void;
        constructor(envelope: Envelope, stack: StackInterface);

        public readonly envelope: Envelope;

        public readonly stack: StackInterface;
    }

    /**
     * Allow to configure messages to be handled after the current bus is finished.
     *
     * I.e, messages dispatched from a handler with a DispatchAfterCurrentBus stamp
     * will actually be handled once the current message being dispatched is fully
     * handled.
     *
     * For instance, using this middleware before the DoctrineTransactionMiddleware
     * means sub-dispatched messages with a DispatchAfterCurrentBus stamp would be
     * handled after the Doctrine transaction has been committed.
     */
    export class DispatchAfterCurrentBusMiddleware extends implementationOf(MiddlewareInterface) {
        private _queue: QueuedEnvelope[];
        private _isRootDispatchCallRunning: boolean;

        constructor();
        __construct(): void;

        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope> | Envelope;
    }
}
