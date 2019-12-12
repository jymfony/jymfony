const StopwatchPeriodInterface = Jymfony.Contracts.Stopwatch.StopwatchPeriodInterface;

/**
 * Represents an Period for an Event.
 *
 * @memberOf Jymfony.Component.Stopwatch
 */
export default class StopwatchPeriod extends implementationOf(StopwatchPeriodInterface) {
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
     * @inheritdoc
     */
    get startTime() {
        return this._start;
    }

    /**
     * @inheritdoc
     */
    get endTime() {
        return this._end;
    }

    /**
     * @inheritdoc
     */
    get duration() {
        return Number((this._end - this._start).toPrecision(6));
    }

    /**
     * @inheritdoc
     */
    get memory() {
        return this._memory;
    }
}
