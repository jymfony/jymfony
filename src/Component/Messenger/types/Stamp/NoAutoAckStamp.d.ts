declare namespace Jymfony.Component.Messenger.Stamp {
    import HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;

    /**
     * Marker telling that ack should not be done automatically for this message.
     *
     * @final
     */
    export class NoAutoAckStamp extends implementationOf(NonSendableStampInterface) {
        private _handlerDescriptor: HandlerDescriptor;

        /**
         * Constructor.
         */
        __construct(handlerDescriptor: HandlerDescriptor): void;
        constructor(handlerDescriptor: HandlerDescriptor);

        public readonly handlerDescriptor: HandlerDescriptor;
    }
}
