const DateTimeFormatter = Jymfony.Component.DateTime.Formatter.DateTimeFormatter;
const Parser = Jymfony.Component.DateTime.Parser.Parser;
const tm_desc = Jymfony.Component.DateTime.Struct.tm_desc;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

/**
 * Represents a datetime.
 * NOTE: this object is immutable. All the methods that modify
 * the object will instead return a new object. If the modified
 * data is equal to the original one, the same object could be
 * returned.
 *
 * @memberOf Jymfony.Component.DateTime
 * @type DateTime
 */
class DateTime {
    /**
     * Constructor.
     *
     * @param {undefined|string|int|Date} datetime The datetime string or unix timestamp
     * @param {undefined|string} timezone The timezone of the datetime
     */
    constructor(datetime = undefined, timezone = undefined) {
        if (undefined === datetime) {
            this._tm = new tm_desc(timezone);
        } else if (isString(datetime)) {
            const p = new Parser();
            this._tm = p.parse(datetime, timezone);
        } else if (isNumber(datetime)) {
            this._tm = new tm_desc(timezone);
            this._tm.unix_timestamp = datetime;
        } else if (datetime instanceof Date) {
            let val = datetime.valueOf();
            this._tm = new tm_desc(timezone);
            this._tm.unix_timestamp = ~~(val / 1000);
            this._tm.tm_msec = val % 1000;
        } else {
            throw new InvalidArgumentException('Argument 1 passed to new DateTime should be a string, a number or undefined');
        }
    }

    /**
     * Gets a new DateTime object representing the current datetime.
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    static get now() {
        return new DateTime();
    }

    /**
     * Gets a new DateTime representing midnight of today.
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    static get today() {
        return (new DateTime()).setTime(0, 0, 0);
    }

    /**
     * Gets a new DateTime representing midnight of today.
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    static get yesterday() {
        let dt = DateTime.today;
        dt._tm.add(new TimeSpan('P-1D'));

        return dt;
    }

    /**
     * Gets the Year component of this datetime instance
     *
     * @returns {int}
     */
    get year() {
        return this._tm.tm_year;
    }

    /**
     * Gets the Month component of this datetime instance
     *
     * @returns {int}
     */
    get month() {
        return this._tm.tm_mon;
    }

    /**
     * Gets the Day component of this datetime instance
     *
     * @returns {int}
     */
    get day() {
        return this._tm.tm_mday;
    }

    /**
     * Gets the Hour component of this datetime instance
     *
     * @returns {int}
     */
    get hour() {
        return this._tm.tm_hour;
    }

    /**
     * Gets the Minute component of this datetime instance
     *
     * @returns {int}
     */
    get minute() {
        return this._tm.tm_min;
    }

    /**
     * Gets the Second component of this datetime instance
     *
     * @returns {int}
     */
    get second() {
        return this._tm.tm_sec;
    }

    /**
     * Gets the Millisecond component of this datetime instance
     *
     * @returns {int}
     */
    get millisecond() {
        return this._tm.tm_msec;
    }

    /**
     * Gets the timezone of this datetime instance
     *
     * @returns {Jymfony.Component.DateTime.DateTimeZone}
     */
    get timezone() {
        return this._tm.tm_tz;
    }

    /**
     * Gets the UNIX timestamp of this instance
     *
     * @returns {int}
     */
    get timestamp() {
        return this._tm.unix_timestamp;
    }

    /**
     * Gets the Day of Week of this instance.
     * 1 = Monday, 7 = Sunday
     *
     * @returns {int}
     */
    get dayOfWeek() {
        return this._tm.tm_wday;
    }

    /**
     * Gets the Day of Year of this instance (1-366).
     *
     * @returns {int}
     */
    get dayOfYear() {
        return this._tm.tm_yday;
    }

    /**
     * Indicates whether this instance of DateTime is within
     * the daylight saving time range for the current time zone.
     *
     * @returns {boolean}
     */
    get isDST() {
        return this._tm.tm_tz.isDST(this);
    }

    /**
     * Indicates whether the year of this instance of DateTime
     * is a leap year.
     *
     * @returns {boolean}
     */
    get isLeapYear() {
        return this._tm.tm_leap;
    }

    /**
     * Modify the time.
     *
     * @param {number} hours
     * @param {number} minutes
     * @param {number} seconds
     * @param {number} milliseconds
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    setTime(hours, minutes, seconds, milliseconds = 0) {
        if (
            hours === this._tm.tm_hour &&
            minutes === this._tm.tm_min &&
            seconds === this._tm.tm_sec &&
            milliseconds === this._tm.tm_msec
        ) {
            return this;
        }

        let val = this.copy();
        val._tm.tm_hour = hours;
        val._tm.tm_min = minutes;
        val._tm.tm_sec = seconds;
        val._tm.tm_msec = milliseconds;

        return val;
    }

    /**
     * Modify the date.
     *
     * @param {number} year
     * @param {number} month
     * @param {number} day
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    setDate(year, month, day) {
        if (
            year === this._tm.tm_year &&
            month === this._tm.tm_mon &&
            day === this._tm.tm_mday
        ) {
            return this;
        }

        let val = this.copy();
        val._tm.tm_year = year;
        val._tm.tm_mon = month;
        val._tm.tm_mday = day;

        if (! val._tm.valid) {
            throw new InvalidArgumentException('Invalid date.');
        }

        return val;
    }

    /**
     * Adds or subtracts a TimeSpan interval
     *
     * @param {Jymfony.Component.DateTime.TimeSpan} interval
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    modify(interval) {
        let val = this.copy();
        val._tm.add(interval);

        return val;
    }

    /**
     * Returns a copy of this object
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    copy() {
        const retVal = new DateTime();
        retVal._tm = this._tm.copy();

        return retVal;
    }

    /**
     * Formats a date time
     *
     * @param {string} format
     *
     * @returns {string}
     */
    format(format) {
        return DateTimeFormatter.format(this, format);
    }

    /**
     * Returns a value indicating whether this object has
     * the same date time value of the specified instance
     *
     * @param {Jymfony.Component.DateTime.DateTime} instance
     * @returns {boolean}
     */
    equals(instance) {
        return instance instanceof DateTime &&
            instance.timestamp === this.timestamp &&
            instance.millisecond === this.millisecond;
    }

    /**
     * @inheritDoc
     */
    toString() {
        return this.format(DateTime.ISO8601);
    }

    /**
     * @inheritDoc
     */
    get [Symbol.toStringTag]() {
        return 'DateTime';
    }
}

/* Constants */
DateTime.ATOM = "Y-m-d\\TH:i:sP" ;
DateTime.COOKIE = "l, d-M-Y H:i:s T" ;
DateTime.ISO8601 = "Y-m-d\\TH:i:sO" ;
DateTime.RFC822 = "D, d M y H:i:s O" ;
DateTime.RFC850 = "l, d-M-y H:i:s T" ;
DateTime.RFC1036 = "D, d M y H:i:s O" ;
DateTime.RFC1123 = "D, d M Y H:i:s O" ;
DateTime.RFC2822 = "D, d M Y H:i:s O" ;
DateTime.RFC3339 = "Y-m-d\\TH:i:sP" ;
DateTime.RSS = "D, d M Y H:i:s O" ;
DateTime.W3C = "Y-m-d\\TH:i:sP" ;

module.exports = DateTime;
