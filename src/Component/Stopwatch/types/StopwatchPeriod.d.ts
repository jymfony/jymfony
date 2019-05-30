declare namespace Jymfony.Component.Stopwatch {
    /**
     * Represents an Period for an Event.
     */
    export class StopwatchPeriod {
        private _start: number;
        private _end: number;
        private _memory: number;

        /**
         * Constructor.
         *
         * @param start The relative time of the start of the period (in milliseconds)
         * @param end The relative time of the end of the period (in milliseconds)
         */
        __construct(start: number, end: number): void;
        constructor(start: number, end: number);

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
