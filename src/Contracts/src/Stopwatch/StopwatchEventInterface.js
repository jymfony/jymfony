/**
 * Represents an Event managed by Stopwatch.
 *
 * @memberOf Jymfony.Contracts.Stopwatch
 */
class StopwatchEventInterface {
    /**
     * Gets the category.
     *
     * @returns {string} The category
     */
    get category() { }

    /**
     * Gets the origin.
     *
     * @returns {number} The origin in milliseconds
     */
    get origin() { }

    /**
     * Starts a new event period.
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface}
     */
    start() { }

    /**
     * Stops the last started event period.
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface}
     *
     * @throws {LogicException} When stop() is called without a matching call to start()
     */
    stop() { }

    /**
     * Checks if the event was started.
     *
     * @returns {boolean}
     */
    isStarted() { }

    /**
     * Stops the current period and then starts a new one.
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface}
     */
    lap() { }

    /**
     * Stops all non already stopped periods.
     */
    ensureStopped() { }

    /**
     * Gets all event periods.
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchPeriodInterface[]} An array of StopwatchPeriod instances
     */
    get periods() { }

    /**
     * Gets the relative time of the start of the first period.
     *
     * @returns {number} The time (in milliseconds)
     */
    get startTime() { }

    /**
     * Gets the relative time of the end of the last period.
     *
     * @returns {number} The time (in milliseconds)
     */
    get endTime() { }

    /**
     * Gets the duration of the events (including all periods).
     *
     * @returns {number} The duration (in milliseconds)
     */
    get duration() { }

    /**
     * Gets the max memory usage of all periods.
     *
     * @returns {int} The memory usage (in bytes)
     */
    get memory() { }
}
