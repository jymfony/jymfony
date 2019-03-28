const StopwatchPeriod = Jymfony.Component.Stopwatch.StopwatchPeriod;
const { performance } = require('perf_hooks');

/**
 * Represents an Event managed by Stopwatch.
 *
 * @memberOf Jymfony.Component.Stopwatch
 */
class StopwatchEvent {
    /**
     * Constructor.
     *
     * @param {number} origin The origin time in milliseconds
     * @param {string|null} [category] The event category or null to use the default
     *
     * @throws {InvalidArgumentException} When the raw time is not valid
     */
    __construct(origin, category = null) {
        /**
         * @type {Jymfony.Component.Stopwatch.StopwatchPeriod[]}
         *
         * @private
         */
        this._periods = [];

        /**
         * @type {number}
         *
         * @private
         */
        this._origin = this._formatTime(origin);

        /**
         * @type {string}
         *
         * @private
         */
        this._category = isString(category) ? category : 'default';

        /**
         * @type {number[]}
         *
         * @private
         */
        this._started = [];
    }

    /**
     * Gets the category.
     *
     * @returns {string} The category
     */
    get category() {
        return this._category;
    }

    /**
     * Gets the origin.
     *
     * @returns {number} The origin in milliseconds
     */
    get origin() {
        return this._origin;
    }

    /**
     * Starts a new event period.
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent}
     */
    start() {
        this._started.push(this._getNow());

        return this;
    }

    /**
     * Stops the last started event period.
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent}
     *
     * @throws {LogicException} When stop() is called without a matching call to start()
     */
    stop() {
        if (0 === this._started.length) {
            throw new LogicException('stop() called but start() has not been called before.');
        }

        this._periods.push(new StopwatchPeriod(this._started.pop(), this._getNow()));

        return this;
    }

    /**
     * Checks if the event was started.
     *
     * @returns {boolean}
     */
    isStarted() {
        return 0 < this._started.length;
    }

    /**
     * Stops the current period and then starts a new one.
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent}
     */
    lap() {
        return this.stop().start();
    }

    /**
     * Stops all non already stopped periods.
     */
    ensureStopped() {
        while (0 < this._started.length) {
            this.stop();
        }
    }

    /**
     * Gets all event periods.
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchPeriod[]} An array of StopwatchPeriod instances
     */
    get periods() {
        return [ ...this._periods ];
    }

    /**
     * Gets the relative time of the start of the first period.
     *
     * @returns {number} The time (in milliseconds)
     */
    get startTime() {
        return this._periods[0] ? this._periods[0].startTime : 0;
    }

    /**
     * Gets the relative time of the end of the last period.
     *
     * @returns {number} The time (in milliseconds)
     */
    get endTime() {
        const count = this._periods.length;

        return count ? this._periods[count - 1].endTime : 0;
    }

    /**
     * Gets the duration of the events (including all periods).
     *
     * @returns {number} The duration (in milliseconds)
     */
    get duration() {
        const periods = this._periods;
        const stopped = periods.length;
        const left = this._started.length - stopped;

        for (let i = 0; i < left; ++i) {
            const index = stopped + i;
            periods.push(new StopwatchPeriod(this._started[index], this._getNow()));
        }

        let total = 0;
        for (const period of periods) {
            total += period.duration;
        }

        return total;
    }

    /**
     * Gets the max memory usage of all periods.
     *
     * @returns {int} The memory usage (in bytes)
     */
    get memory() {
        let memory = 0;
        for (const period of this._periods) {
            if (period.memory > memory) {
                memory = period.memory;
            }
        }

        return memory;
    }

    /**
     * @return string
     */
    toString() {
        return __jymfony.sprintf('%s: %.2F MiB - %d ms', this.category, this.memory / 1024 / 1024, this.duration);
    }

    /**
     * Return the current time relative to origin.
     *
     * @returns {float} Time in ms
     *
     * @protected
     */
    _getNow() {
        return this._formatTime(((performance.now() + performance.timeOrigin) / 1000) - this._origin);
    }

    /**
     * Formats a time.
     *
     * @param {number} time A raw time
     *
     * @returns {number} The formatted time
     *
     * @throws {InvalidArgumentException} When the raw time is not valid
     *
     * @private
     */
    _formatTime(time) {
        if (! isNumber(time)) {
            throw new InvalidArgumentException('The time must be a numerical value');
        }

        return Number(time.toFixed(1));
    }
}

module.exports = StopwatchEvent;
