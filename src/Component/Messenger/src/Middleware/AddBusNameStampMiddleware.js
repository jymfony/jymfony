const BusNameStamp = Jymfony.Component.Messenger.Stamp.BusNameStamp;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;

/**
 * Adds the BusNameStamp to the bus.
 *
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class AddBusNameStampMiddleware extends implementationOf(MiddlewareInterface) {
    /**
     * Constructor.
     *
     * @param {string} busName
     */
    __construct(busName) {
        /**
         * @type {string}
         *
         * @private
         */
        this._busName = busName;
    }

    handle(envelope, stack) {
        if (null === envelope.last(BusNameStamp)) {
            envelope = envelope.withStamps(new BusNameStamp(this._busName));
        }

        return stack.next().handle(envelope, stack);
    }
}
