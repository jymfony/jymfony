/**
 * Represents an Period for an Event.
 *
 * @memberOf Jymfony.Contracts.Stopwatch
 */
class StopwatchPeriodInterface {
    /**
     * Gets the relative time of the start of the period.
     *
     * @returns {number} The time (in milliseconds)
     */
    get startTime() { }

    /**
     * Gets the relative time of the end of the period.
     *
     * @returns {number} The time (in milliseconds)
     */
    get endTime() { }

    /**
     * Gets the time spent in this period.
     *
     * @returns {number} The period duration (in milliseconds)
     */
    get duration() { }

    /**
     * Gets the memory usage.
     *
     * @returns {int} The memory usage (in bytes)
     */
    get memory() { }
}

export default getInterface(StopwatchPeriodInterface);
