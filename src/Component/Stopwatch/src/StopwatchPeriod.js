/**
 * Represents an Period for an Event.
 *
 * @memberOf Jymfony.Component.Stopwatch
 */
class StopwatchPeriod {
    /**
     * Constructor.
     *
     * @param {number} start The relative time of the start of the period (in milliseconds)
     * @param {number} end The relative time of the end of the period (in milliseconds)
     */
    __construct(start, end) {
        /**
         * @type {number}
         *
         * @private
         */
        this._start = start;

        /**
         * @type {number}
         *
         * @private
         */
        this._end = end;

        /**
         * @type {number}
         *
         * @private
         */
        this._memory = process.memoryUsage().heapTotal;
    }

    /**
     * Gets the relative time of the start of the period.
     *
     * @returns {number} The time (in milliseconds)
     */
    get startTime() {
        return this._start;
    }

    /**
     * Gets the relative time of the end of the period.
     *
     * @returns {number} The time (in milliseconds)
     */
    get endTime() {
        return this._end;
    }

    /**
     * Gets the time spent in this period.
     *
     * @returns {number} The period duration (in milliseconds)
     */
    get duration() {
        return Number((this._end - this._start).toPrecision(6));
    }

    /**
     * Gets the memory usage.
     *
     * @returns {int} The memory usage (in bytes)
     */
    get memory() {
        return this._memory;
    }
}

module.exports = StopwatchPeriod;
