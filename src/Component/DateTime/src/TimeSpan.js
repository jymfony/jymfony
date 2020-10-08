const InvalidDateTimeStringException = Jymfony.Component.DateTime.Exception.InvalidDateTimeStringException;
const TimeSpanInterface = Jymfony.Contracts.DateTime.TimeSpanInterface;

/**
 * Represents a time interval.
 *
 * @memberOf Jymfony.Component.DateTime
 */
export default class TimeSpan extends implementationOf(TimeSpanInterface) {
    /**
     * Constructor.
     *
     * @param {string} [duration]
     */
    __construct(duration = undefined) {
        /**
         * @type {int}
         *
         * @private
         */
        this._milliseconds = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._seconds = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._minutes = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._hours = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._days = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._months = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._years = 0;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._inverse = false;

        if (undefined !== duration) {
            this._parse(duration);
        }
    }

    /**
     * @returns {boolean}
     */
    get inverse() {
        return this._inverse;
    }

    /**
     * @param {boolean} inverse
     */
    set inverse(inverse) {
        this._inverse = !! inverse;
    }

    /**
     * @returns {int}
     */
    get milliseconds() {
        return this._milliseconds;
    }

    /**
     * @param {int} millis
     */
    set milliseconds(millis) {
        if (0 > millis || 1000 <= millis) {
            throw new InvalidArgumentException('Invalid value for milliseconds: ' + millis);
        }

        this._milliseconds = ~~millis;
    }

    /**
     * @returns {int}
     */
    get seconds() {
        return this._seconds;
    }

    /**
     * @param {int} seconds
     */
    set seconds(seconds) {
        if (0 > seconds || 60 <= seconds) {
            throw new InvalidArgumentException('Invalid value for seconds: ' + seconds);
        }

        this._seconds = ~~seconds;
    }

    /**
     * @returns {int}
     */
    get minutes() {
        return this._minutes;
    }

    /**
     * @param {int} mins
     */
    set minutes(mins) {
        if (0 > mins || 60 <= mins) {
            throw new InvalidArgumentException('Invalid value for minutes: ' + mins);
        }

        this._minutes = ~~mins;
    }

    /**
     * @returns {int}
     */
    get hours() {
        return this._hours;
    }

    /**
     * @param {int} hours
     */
    set hours(hours) {
        if (0 > hours || 23 <= hours) {
            throw new InvalidArgumentException('Invalid value for hours: ' + hours);
        }

        this._hours = ~~hours;
    }

    /**
     * @returns {int}
     */
    get days() {
        return this._days;
    }

    /**
     * @param {int} days
     */
    set days(days) {
        if (0 > days) {
            throw new InvalidArgumentException('Invalid value for days: ' + days);
        }

        this._days = ~~days;
    }

    /**
     * @returns {int}
     */
    get months() {
        return this._months;
    }

    /**
     * @param {int} months
     */
    set months(months) {
        if (0 > months) {
            throw new InvalidArgumentException('Invalid value for months: ' + months);
        }

        this._months = ~~months;
    }

    /**
     * @returns {int}
     */
    get years() {
        return this._years;
    }

    /**
     * @param {int} years
     */
    set years(years) {
        if (0 > years) {
            throw new InvalidArgumentException('Invalid value for years: ' + years);
        }

        this._years = ~~years;
    }

    /**
     * @param {string} isoDuration
     *
     * @private
     */
    _parse(isoDuration) {
        const regex = /^P([+\-])?(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        const matches = isoDuration.match(regex);

        if (! matches) {
            throw new InvalidDateTimeStringException(`${isoDuration} is not a valid timespan format`);
        }

        this._inverse = '-' === matches[1];
        this.years = matches[2] || 0;
        this.months = matches[3] || 0;
        this.days = matches[4] || 0;
        this.hours = matches[5] || 0;
        this.minutes = matches[6] || 0;
        this.seconds = matches[7] || 0;
    }
}
