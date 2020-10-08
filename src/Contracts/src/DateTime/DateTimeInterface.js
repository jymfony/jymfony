/**
 * Represents a datetime.
 * NOTE: this object is immutable. All the methods that modify
 * the object will instead return a new object. If the modified
 * data is equal to the original one, the same object could be
 * returned.
 *
 * @memberOf Jymfony.Contracts.DateTime
 */
class DateTimeInterface {
    /**
     * Gets the year.
     *
     * @returns {int}
     */
    get year() { }

    /**
     * Gets the month.
     *
     * @returns {int}
     */
    get month() { }

    /**
     * Gets the day.
     *
     * @returns {int}
     */
    get day() { }

    /**
     * Gets the hour.
     *
     * @returns {int}
     */
    get hour() { }

    /**
     * Gets the minutes.
     *
     * @returns {int}
     */
    get minute() { }

    /**
     * Gets the seconds.
     *
     * @returns {int}
     */
    get second() { }

    /**
     * Gets the milliseconds.
     *
     * @returns {int}
     */
    get millisecond() { }

    /**
     * Gets the timezone.
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeZoneInterface}
     */
    get timezone() { }

    /**
     * Gets the UNIX timestamp.
     *
     * @returns {int}
     */
    get timestamp() { }

    /**
     * Gets the UNIX timestamp with milliseconds.
     *
     * @returns {float}
     */
    get microtime() { }

    /**
     * Gets the Day of Week of this instance.
     * 1 = Monday, 7 = Sunday
     *
     * @returns {int}
     */
    get dayOfWeek() { }

    /**
     * Gets the Day of Year of this instance (1-366).
     *
     * @returns {int}
     */
    get dayOfYear() { }

    /**
     * Indicates whether this instance of DateTime is within
     * the daylight saving time range for the current time zone.
     *
     * @returns {boolean}
     */
    get isDST() { }

    /**
     * Indicates whether the year of this instance of DateTime is a leap year.
     *
     * @returns {boolean}
     */
    get isLeapYear() { }

    /**
     * Modify the time.
     *
     * @param {int} hours
     * @param {int} minutes
     * @param {int} seconds
     * @param {int} [milliseconds = 0]
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    setTime(hours, minutes, seconds, milliseconds = 0) { }

    /**
     * Modify the date.
     *
     * @param {int} year
     * @param {int} month
     * @param {int} day
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    setDate(year, month, day) { }

    /**
     * Modify the timezone.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeZoneInterface} timezone
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    setTimeZone(timezone) { }

    /**
     * Adds or subtracts a TimeSpan interval.
     *
     * @param {Jymfony.Contracts.DateTime.TimeSpanInterface} interval
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    modify(interval) { }

    /**
     * Returns a copy of the current instance.
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    copy() { }

    /**
     * Formats a DateTime.
     *
     * @param {string} format
     *
     * @returns {string}
     */
    format(format) { }

    /**
     * Returns a value indicating whether this object has
     * the same date time value of the specified instance.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface} instance
     *
     * @returns {boolean}
     */
    equals(instance) { }
}

/* Constants */
Object.defineProperties(DateTimeInterface, {
    ATOM: { writable: false, value: 'Y-m-d\\TH:i:sP' },
    COOKIE: { writable: false, value: 'l, d-M-Y H:i:s T' },
    ISO8601: { writable: false, value: 'Y-m-d\\TH:i:sO' },
    RFC822: { writable: false, value: 'D, d M y H:i:s O' },
    RFC850: { writable: false, value: 'l, d-M-y H:i:s T' },
    RFC1036: { writable: false, value: 'D, d M y H:i:s O' },
    RFC1123: { writable: false, value: 'D, d M Y H:i:s O' },
    RFC2822: { writable: false, value: 'D, d M Y H:i:s O' },
    RFC3339: { writable: false, value: 'Y-m-d\\TH:i:sP' },
    RSS: { writable: false, value: 'D, d M Y H:i:s O' },
    W3C: { writable: false, value: 'Y-m-d\\TH:i:sP' },
});

export default getInterface(DateTimeInterface);
