const DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
const DateTimeFormatter = Jymfony.Component.DateTime.Formatter.DateTimeFormatter;
const Parser = Jymfony.Component.DateTime.Parser.Parser;
const TimeDescriptor = Jymfony.Component.DateTime.Struct.TimeDescriptor;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

/**
 * Represents a datetime.
 * NOTE: this object is immutable. All the methods that modify
 * the object will instead return a new object. If the modified
 * data is equal to the original one, the same object could be
 * returned.
 *
 * @memberOf Jymfony.Component.DateTime
 */
export default class DateTime extends implementationOf(DateTimeInterface) {
    /**
     * Constructor.
     *
     * @param {undefined|string|int|Date} [datetime] The datetime string or unix timestamp
     * @param {undefined|string|Jymfony.Contracts.DateTime.DateTimeZoneInterface} [timezone] The timezone of the datetime
     */
    __construct(datetime = undefined, timezone = undefined) {
        if (undefined === datetime) {
            const d = new Date();
            this._tm = new TimeDescriptor(timezone);
            this._tm.unixTimestamp = ~~(d.getTime() / 1000);
        } else if (isString(datetime)) {
            const p = new Parser();
            this._tm = p.parse(datetime, timezone);
        } else if (isNumber(datetime)) {
            this._tm = new TimeDescriptor(timezone);
            this._tm.unixTimestamp = datetime;
        } else if (datetime instanceof Date) {
            const val = datetime.valueOf();
            this._tm = new TimeDescriptor(timezone);
            this._tm.unixTimestamp = ~~(val / 1000);
            this._tm.milliseconds = val % 1000;
        } else if (datetime instanceof __self) {
            this._tm = datetime._tm.copy();
        } else {
            throw new InvalidArgumentException('Argument 1 passed to new DateTime should be a string, a number or undefined');
        }
    }

    /**
     * Parse a string into a new DateTime object according to the specified format
     *
     * @param {string} format
     * @param {string} time
     * @param {undefined|string|Jymfony.Contracts.DateTime.DateTimeZoneInterface} [timezone]
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    static createFromFormat(format, time, timezone = undefined) {
        const obj = new __self();
        obj._tm = DateTimeFormatter.parse(format, time);
        if (timezone) {
            obj._tm.timeZone = timezone;
        }

        return obj;
    }

    /**
     * Gets a new DateTime representing the current datetime.
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    static get now() {
        return new DateTime();
    }

    /**
     * Gets current timestamp.
     *
     * @returns {int}
     */
    static get unixTime() {
        return (new DateTime()).timestamp;
    }

    /**
     * Gets a new DateTime representing midnight of today.
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    static get today() {
        return (new DateTime()).setTime(0, 0, 0);
    }

    /**
     * Gets a new DateTime representing midnight of today.
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    static get yesterday() {
        const dt = DateTime.today;
        dt._tm.add(new TimeSpan('P-1D'));

        return dt;
    }

    /**
     * Gets the year.
     *
     * @returns {int}
     */
    get year() {
        return this._tm._year;
    }

    /**
     * Gets the month.
     *
     * @returns {int}
     */
    get month() {
        return this._tm.month;
    }

    /**
     * Gets the day.
     *
     * @returns {int}
     */
    get day() {
        return this._tm.day;
    }

    /**
     * Gets the hour.
     *
     * @returns {int}
     */
    get hour() {
        return this._tm.hour;
    }

    /**
     * Gets the minutes.
     *
     * @returns {int}
     */
    get minute() {
        return this._tm.minutes;
    }

    /**
     * Gets the seconds.
     *
     * @returns {int}
     */
    get second() {
        return this._tm.seconds;
    }

    /**
     * Gets the milliseconds.
     *
     * @returns {int}
     */
    get millisecond() {
        return this._tm.milliseconds;
    }

    /**
     * Gets the timezone.
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeZoneInterface}
     */
    get timezone() {
        return this._tm.timeZone;
    }

    /**
     * Gets the UNIX timestamp.
     *
     * @returns {int}
     */
    get timestamp() {
        return this._tm.unixTimestamp;
    }

    /**
     * Gets the UNIX timestamp with milliseconds.
     *
     * @returns {float}
     */
    get microtime() {
        return this._tm.unixTimestamp + (this._tm.milliseconds / 1000);
    }

    /**
     * Gets the Day of Week of this instance.
     * 1 = Monday, 7 = Sunday
     *
     * @returns {int}
     */
    get dayOfWeek() {
        return this._tm.weekDay;
    }

    /**
     * Gets the Day of Year of this instance (1-366).
     *
     * @returns {int}
     */
    get dayOfYear() {
        return this._tm.yearDay;
    }

    /**
     * Indicates whether this instance of DateTime is within
     * the daylight saving time range for the current time zone.
     *
     * @returns {boolean}
     */
    get isDST() {
        return this._tm.timeZone.isDST(this);
    }

    /**
     * Indicates whether the year of this instance of DateTime is a leap year.
     *
     * @returns {boolean}
     */
    get isLeapYear() {
        return this._tm.leap;
    }

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
    setTime(hours, minutes, seconds, milliseconds = 0) {
        if (
            hours === this._tm.hour &&
            minutes === this._tm.minutes &&
            seconds === this._tm.seconds &&
            milliseconds === this._tm.milliseconds
        ) {
            return this;
        }

        const val = this.copy();
        val._tm.hour = hours;
        val._tm.minutes = minutes;
        val._tm.seconds = seconds;
        val._tm.milliseconds = milliseconds;

        return val;
    }

    /**
     * Modify the date.
     *
     * @param {int} year
     * @param {int} month
     * @param {int} day
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    setDate(year, month, day) {
        if (
            year === this._tm._year &&
            month === this._tm.month &&
            day === this._tm.day
        ) {
            return this;
        }

        const val = this.copy();
        val._tm._year = year;
        val._tm.month = month;
        val._tm.day = day;

        if (! val._tm.valid) {
            throw new InvalidArgumentException('Invalid date.');
        }

        return val;
    }

    /**
     * Modify the timezone.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeZoneInterface} timezone
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    setTimeZone(timezone) {
        const val = this.copy();
        if (timezone === val._tm.timeZone) {
            return this;
        }

        val._tm.timeZone = timezone;
        this._tm._updateTime();

        return val;
    }

    /**
     * Adds or subtracts a TimeSpan interval.
     *
     * @param {Jymfony.Contracts.DateTime.TimeSpanInterface} interval
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    modify(interval) {
        const val = this.copy();
        val._tm.add(interval);

        return val;
    }

    /**
     * Returns a copy of the current instance.
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    copy() {
        const retVal = new DateTime();
        retVal._tm = this._tm.copy();

        return retVal;
    }

    /**
     * Formats a DateTime.
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
     * the same date time value of the specified instance.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface} instance
     *
     * @returns {boolean}
     */
    equals(instance) {
        return instance instanceof DateTimeInterface &&
            instance.timestamp === this.timestamp &&
            instance.millisecond === this.millisecond;
    }

    /**
     * @inheritdoc
     */
    toString() {
        return this.format(DateTime.ISO8601);
    }

    /**
     * @inheritdoc
     */
    get [Symbol.toStringTag]() {
        return 'DateTime';
    }
}

/* Constants */
Object.defineProperties(DateTime, {
    ATOM: { writable: false, value: DateTimeInterface.ATOM },
    COOKIE: { writable: false, value: DateTimeInterface.COOKIE },
    ISO8601: { writable: false, value: DateTimeInterface.ISO8601 },
    RFC822: { writable: false, value: DateTimeInterface.RFC822 },
    RFC850: { writable: false, value: DateTimeInterface.RFC850 },
    RFC1036: { writable: false, value: DateTimeInterface.RFC1036 },
    RFC1123: { writable: false, value: DateTimeInterface.RFC1123 },
    RFC2822: { writable: false, value: DateTimeInterface.RFC2822 },
    RFC3339: { writable: false, value: DateTimeInterface.RFC3339 },
    RSS: { writable: false, value: DateTimeInterface.RSS },
    W3C: { writable: false, value: DateTimeInterface.W3C },
});
