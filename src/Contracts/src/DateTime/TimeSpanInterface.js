/**
 * Represents a time interval.
 *
 * @memberOf Jymfony.Contracts.DateTime
 */
class TimeSpanInterface {
    /**
     * @returns {boolean}
     */
    get inverse() { }

    /**
     * @param {boolean} inverse
     */
    set inverse(inverse) { }

    /**
     * @returns {int}
     */
    get milliseconds() { }

    /**
     * @param {int} millis
     */
    set milliseconds(millis) { }

    /**
     * @returns {int}
     */
    get seconds() { }

    /**
     * @param {int} seconds
     */
    set seconds(seconds) { }

    /**
     * @returns {int}
     */
    get minutes() { }

    /**
     * @param {int} mins
     */
    set minutes(mins) { }

    /**
     * @returns {int}
     */
    get hours() { }

    /**
     * @param {int} hours
     */
    set hours(hours) { }

    /**
     * @returns {int}
     */
    get days() { }

    /**
     * @param {int} days
     */
    set days(days) { }

    /**
     * @returns {int}
     */
    get months() { }

    /**
     * @param {int} months
     */
    set months(months) { }

    /**
     * @returns {int}
     */
    get years() { }

    /**
     * @param {int} years
     */
    set years(years) { }
}

export default getInterface(TimeSpanInterface);
