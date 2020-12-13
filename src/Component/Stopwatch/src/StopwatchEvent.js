import { performance } from 'perf_hooks';

const StopwatchEventInterface = Jymfony.Contracts.Stopwatch.StopwatchEventInterface;
const StopwatchPeriod = Jymfony.Component.Stopwatch.StopwatchPeriod;

/**
 * Represents an Event managed by Stopwatch.
 *
 * @memberOf Jymfony.Component.Stopwatch
 */
export default class StopwatchEvent extends implementationOf(StopwatchEventInterface) {
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
     * @inheritdoc
     */
    get category() {
        return this._category;
    }

    /**
     * @inheritdoc
     */
    get origin() {
        return this._origin;
    }

    /**
     * @inheritdoc
     */
    start() {
        this._started.push(this._getNow());

        return this;
    }

    /**
     * @inheritdoc
     */
    stop() {
        if (0 === this._started.length) {
            throw new LogicException('stop() called but start() has not been called before.');
        }

        this._periods.push(new StopwatchPeriod(this._started.pop(), this._getNow()));

        return this;
    }

    /**
     * @inheritdoc
     */
    isStarted() {
        return 0 < this._started.length;
    }

    /**
     * @inheritdoc
     */
    lap() {
        return this.stop().start();
    }

    /**
     * @inheritdoc
     */
    ensureStopped() {
        while (0 < this._started.length) {
            this.stop();
        }
    }

    /**
     * @inheritdoc
     */
    get periods() {
        return [ ...this._periods ];
    }

    /**
     * @inheritdoc
     */
    get startTime() {
        return this._periods[0] ? this._periods[0].startTime : 0;
    }

    /**
     * @inheritdoc
     */
    get endTime() {
        const count = this._periods.length;

        return count ? this._periods[count - 1].endTime : 0;
    }

    /**
     * @inheritdoc
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

        return +total.toPrecision(7);
    }

    /**
     * @inheritdoc
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
     * @returns {string}
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
