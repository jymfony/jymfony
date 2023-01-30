const Envelope = Jymfony.Component.Messenger.Envelope;

/**
 * Event is dispatched before a message is sent to the transport.
 *
 * The event is *only* dispatched if the message will actually
 * be sent to at least one transport. If the message is sent
 * to multiple transports, the message is dispatched only one time.
 * This message is only dispatched the first time a message
 * is sent to a transport, not also if it is retried.
 *
 * @memberOf Jymfony.Component.Messenger.Event
 * @final
 */
export default class SendMessageToTransportsEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     */
    __construct(envelope) {
        /**
         * @type {Jymfony.Component.Messenger.Envelope}
         *
         * @private
         */
        this._envelope = envelope;
    }

    get envelope() {
        return this._envelope;
    }

    set envelope(envelope) {
        if (!(envelope instanceof Envelope)) {
            throw new TypeError(__jymfony.sprintf('Argument #1 passed to %s.set envelope should be an instance of %s, %s passed', ReflectionClass.getClassName(this), ReflectionClass.getClassName(Envelope), __jymfony.get_debug_type(envelope)));
        }

        this._envelope = envelope;
    }
}
