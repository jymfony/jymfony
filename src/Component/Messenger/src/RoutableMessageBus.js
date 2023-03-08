const BusNameStamp = Jymfony.Component.Messenger.Stamp.BusNameStamp;
const Envelope = Jymfony.Component.Messenger.Envelope;
const InvalidArgumentException = Jymfony.Component.Messenger.Exception.InvalidArgumentException;
const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;

/**
 * Bus of buses that is routable using a BusNameStamp.
 *
 * This is useful when passed to Worker: messages received
 * from the transport can be sent to the correct bus.
 *
 * @memberOf Jymfony.Component.Messenger
 */
export default class RoutableMessageBus extends implementationOf(MessageBusInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.DependencyInjection.ContainerInterface} busLocator
     * @param {Jymfony.Component.Messenger.MessageBusInterface} [fallbackBus = null]
     */
    __construct(busLocator, fallbackBus = null) {
        /**
         * @type {Jymfony.Contracts.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._busLocator = busLocator;

        /**
         * @type {Jymfony.Component.Messenger.MessageBusInterface}
         *
         * @private
         */
        this._fallbackBus = fallbackBus;
    }

    /**
     * @param {object|Jymfony.Component.Messenger.Envelope} message The message or the message pre-wrapped in an envelope
     * @param {Jymfony.Component.Messenger.Stamp.StampInterface[]} [stamps]
     */
    dispatch(message, stamps = []) {
        if (! message instanceof Envelope) {
            throw new InvalidArgumentException('Messages passed to RoutableMessageBus.dispatch() must be inside an Envelope.');
        }

        /** @type {Jymfony.Component.Messenger.Stamp.BusNameStamp|null} busNameStamp */
        const busNameStamp = message.last(BusNameStamp);

        if (null === busNameStamp) {
            if (null === this._fallbackBus) {
                throw new InvalidArgumentException('Envelope is missing a BusNameStamp and no fallback message bus is configured on RoutableMessageBus.');
            }

            return this._fallbackBus.dispatch(message, stamps);
        }

        return this.getMessageBus(busNameStamp.busName).dispatch(message, stamps);
    }

    /**
     * @internal
     */
    getMessageBus(busName) {
        if (! this._busLocator.has(busName)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Bus named "%s" does not exist.', busName));
        }

        return this._busLocator.get(busName);
    }
}
