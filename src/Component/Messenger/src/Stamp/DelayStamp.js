const DateTime = Jymfony.Component.DateTime.DateTime;
const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * Apply this stamp to delay delivery of your message on a transport.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class DelayStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {int} delay The delay in milliseconds
     */
    __construct(delay) {
        /**
         * @type {int}
         *
         * @private
         */
        this._delay = delay;
    }

    /**
     * @returns {int}
     */
    get delay() {
        return this._delay;
    }

    /**
     * @param {Jymfony.Contracts.DateTime.TimeSpanInterface} interval
     *
     * @returns {Jymfony.Component.Messenger.Stamp.DelayStamp}
     */
    static delayFor(interval) {
        const now = DateTime.now;
        const end = now.modify(interval);

        return new __self((end.timestamp - now.timestamp) * 1000);
    }

    /**
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface} dateTime
     *
     * @returns {Jymfony.Component.Messenger.Stamp.DelayStamp}
     */
    static delayUntil(dateTime) {
        return new __self((dateTime.timestamp - DateTime.unixTime) * 1000);
    }
}
