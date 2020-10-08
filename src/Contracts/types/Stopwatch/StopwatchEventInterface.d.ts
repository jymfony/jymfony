declare namespace Jymfony.Contracts.Stopwatch {
    /**
     * Represents an Event managed by Stopwatch.
     */
    export class StopwatchEventInterface {
        public static readonly definition: Newable<StopwatchEventInterface>;

        /**
         * Gets the category.
         */
        public readonly category: string;

        /**
         * Gets the origin.
         */
        public readonly origin: number;

        /**
         * Starts a new event period.
         */
        start(): this;

        /**
         * Stops the last started event period.
         *
         * @throws {LogicException} When stop() is called without a matching call to start()
         */
        stop(): this;

        /**
         * Checks if the event was started.
         */
        isStarted(): boolean;

        /**
         * Stops the current period and then starts a new one.
         */
        lap(): this;

        /**
         * Stops all non already stopped periods.
         */
        ensureStopped(): void;

        /**
         * Gets all event periods.
         */
        public readonly periods: StopwatchPeriodInterface[];

        /**
         * Gets the relative time of the start of the first period.
         */
        public readonly startTime: number;

        /**
         * Gets the relative time of the end of the last period.
         */
        public readonly endTime: number;

        /**
         * Gets the duration of the events (including all periods).
         */
        public readonly duration: number;

        /**
         * Gets the max memory usage of all periods (in bytes).
         */
        public readonly memory: number;
    }
}
