declare namespace Jymfony.Component.Messenger.Event {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * Event is dispatched before a message is sent to the transport.
     *
     * The event is *only* dispatched if the message will actually
     * be sent to at least one transport. If the message is sent
     * to multiple transports, the message is dispatched only one time.
     * This message is only dispatched the first time a message
     * is sent to a transport, not also if it is retried.
     *
     * @final
     */
    export class SendMessageToTransportsEvent {
        private _envelope: Envelope;

        /**
         * Constructor.
         */
        __construct(envelope: Envelope): void;
        constructor(envelope: Envelope);

        public envelope: Envelope;
    }
}
