declare namespace Jymfony.Contracts.Stopwatch {
    /**
     * Represents an Period for an Event.
     */
    export class StopwatchPeriodInterface extends MixinInterface {
        public static readonly definition: Newable<StopwatchPeriodInterface>;

        /**
         * Gets the relative time of the start of the period.
         */
        public readonly startTime: number;

        /**
         * Gets the relative time of the end of the period.
         */
        public readonly endTime: number;

        /**
         * Gets the time spent in this period.
         */
        public readonly duration: number;

        /**
         * Gets the memory usage (in bytes).
         */
        public memory: number;
    }
}
