const LogicException = Jymfony.Component.Messenger.Exception.LogicException;
const HandledStamp = Jymfony.Component.Messenger.Stamp.HandledStamp;

/**
 * Leverages a message bus to expect a single, synchronous message handling and return its result.
 *
 * @memberOf Jymfony.Component.Messenger
 */
class HandleTrait {
    __construct() {
        /**
         * @type {Jymfony.Component.Messenger.MessageBusInterface}
         *
         * @private
         */
        this._messageBus = null;
    }

    /**
     * Dispatches the given message, expecting to be handled by a single handler
     * and returns the result from the handler returned value.
     * This behavior is useful for both synchronous command & query buses,
     * the last one usually returning the handler result.
     *
     * @param {object|Jymfony.Component.Messenger.Envelope} message The message or the message pre-wrapped in an envelope
     *
     * @private
     */
    async _handle(message) {
        if (! this._messageBus) {
            throw new LogicException(__jymfony.sprintf('You must provide a "%s" instance in the "%s._messageBus" property, but that property has not been initialized yet.', ReflectionClass.getClassName(MessageBusInterface), ReflectionClass.getClassName(this)));
        }

        const envelope = await this._messageBus.dispatch(message);

        /** @type {Jymfony.Component.Messenger.Stamp.HandledStamp[]} handledStamps */
        const handledStamps = envelope.all(HandledStamp);
        if (0 === handledStamps.length) {
            throw new LogicException(__jymfony.sprintf('Message of type "%s" was handled zero times. Exactly one handler is expected when using "%s._handle()".', __jymfony.get_debug_type(envelope.message), ReflectionClass.getClassName(this)));
        }

        if (1 < handledStamps.length) {
            const handlers = handledStamps.map(stamp => __jymfony.sprintf('"%s"', stamp.handlerName)).join(', ');

            throw new LogicException(__jymfony.sprintf('Message of type "%s" was handled multiple times. Only one handler is expected when using "%s._handle()", got %d: %s.', __jymfony.get_debug_type(envelope.message), ReflectionClass.getClassName(this), handledStamps.length, handlers));
        }

        return handledStamps[0].result;
    }
}

export default getTrait(HandleTrait);
