declare namespace Jymfony.Component.Messenger.Stamp {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
    import TimeSpanInterface = Jymfony.Contracts.DateTime.TimeSpanInterface;

    /**
     * Apply this stamp to delay delivery of your message on a transport.
     *
     * @memberOf Jymfony.Component.Messenger.Stamp
     * @final
     */
    export class DelayStamp extends implementationOf(StampInterface) {
        private _delay: number;

        /**
         * Constructor.
         *
         * @param delay The delay in milliseconds
         */
        __construct(delay: number): void;
        constructor(delay: number);

        public readonly delay: number;

        static delayFor(interval: TimeSpanInterface): DelayStamp;

        static delayUntil(dateTime: DateTimeInterface): DelayStamp;
    }
}
