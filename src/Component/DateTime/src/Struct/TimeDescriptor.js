const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;

if (':UTC' === process.env.TZ) {
    delete process.env.TZ;
}

const DEFAULT_TZ = process.env.TZ || 'Etc/UTC';
const daysPerMonth = [
    [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
    [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
];

/**
 * @memberOf Jymfony.Component.DateTime.Struct
 *
 * @internal
 */
export default class TimeDescriptor {
    /**
     * Constructor.
     *
     * @param {string|DateTimeZone} [tz]
     */
    __construct(tz = undefined) {
        if (undefined === tz) {
            tz = DEFAULT_TZ;
        }

        if (! (tz instanceof DateTimeZone)) {
            tz = DateTimeZone.get(tz);
        }

        /**
         * @type {Jymfony.Component.DateTime.DateTimeZone}
         */
        this.timeZone = tz;

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
        this._hour = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._day = 1;

        /**
         * @type {int}
         *
         * @private
         */
        this._month = 1;

        /**
         * @type {int}
         *
         * @private
         */
        this._year = 1970;

        const d = new Date();
        this.unixTimestamp = 0;
        this.daysFromEpoch = ~~(d.getTime() / 86400000);
    }

    /**
     * Sets the year in short version (70-69 = 1970-2069).
     *
     * @param {int} year
     */
    set shortYear(year) {
        year = ~~year;
        if (0 > year || 99 < year) {
            throw new InvalidArgumentException('Short _year cannot be greater than 99 or less than 0');
        }

        if (70 > year) {
            this._year = 2000 + year;
        } else {
            this._year = 1900 + year;
        }

        this._makeTime();
    }

    /**
     * Gets the day.
     *
     * @returns {int}
     */
    get day() {
        return this._day;
    }

    /**
     * Sets the day.
     *
     * @param {int} day
     *
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set day(day) {
        day = ~~day;

        if (1 > day || 31 < day) {
            throw new InvalidArgumentException('Cannot set day greater than 31 or less than 1');
        }

        this._day = day;
        this._makeTime();
    }

    /**
     * Gets the month.
     *
     * @returns {int}
     */
    get month() {
        return this._month;
    }

    /**
     * Sets the month.
     *
     * @param {int} month
     *
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set month(month) {
        month = ~~month;

        if (1 > month || 12 < month) {
            throw new InvalidArgumentException('Cannot set month greater than 12 or less than 1');
        }

        this._month = month;
        this._makeTime();
    }

    /**
     * Get the seconds.
     *
     * @returns {int}
     */
    get seconds() {
        return this._seconds;
    }

    /**
     * Set the seconds.
     *
     * @param {int} sec
     *
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set seconds(sec) {
        sec = ~~sec;

        if (0 > sec || 59 < sec) {
            throw new InvalidArgumentException('Cannot set seconds greater than 59 or less than 0');
        }

        this._seconds = sec;
        this._makeTime();
    }

    /**
     * Get the milliseconds.
     *
     * @returns {int}
     */
    get milliseconds() {
        return this._milliseconds;
    }

    /**
     * Set the milliseconds.
     *
     * @param {int} msec
     */
    set milliseconds(msec) {
        this._milliseconds = ~~msec.toString().substr(0, 3);
    }

    /**
     * Get the minutes.
     *
     * @returns {int}
     */
    get minutes() {
        return this._minutes;
    }

    /**
     * Set the minutes.
     *
     * @param {int} min
     *
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set minutes(min) {
        min = ~~min;
        if (0 > min || 59 < min) {
            throw new InvalidArgumentException('Cannot set minute greater than 59 or less than 0');
        }

        this._minutes = min;
        this._makeTime();
    }

    /**
     * Get the hour.
     *
     * @returns {int}
     */
    get hour() {
        return this._hour;
    }

    /**
     * Set the hour.
     *
     * @param {int} hour
     *
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set hour(hour) {
        hour = ~~hour;

        if (23 < hour || 0 > hour) {
            throw new InvalidArgumentException('Cannot set hour greater than 23 or less than 0');
        }

        this._hour = hour;
        this._makeTime();
    }

    /**
     * Gets the week day.
     * 1 = Monday, 7 = Sunday
     *
     * @returns {int}
     */
    get weekDay() {
        /*
         Here is a formula for finding the day of the week for ANY date.

         N = d + 2m + [3(m+1)/5] + y + [y/4] - [y/100] + [y/400] + 2

         where d is the number or the day of the month, m is the number of the
         month, and y is the _year. The brackets around the divisions mean to
         drop the remainder and just use the integer part that you get.

         Also, a VERY IMPORTANT RULE is the number to use for the months for
         January and February. The numbers of these months are 13 and 14 of the
         PREVIOUS YEAR. This means that to find the day of the week of New
         Year's Day this _year, 1/1/98, you must use the date 13/1/97. (It
         sounds complicated, but I will do a couple of examples for you.)

         After you find the number N, divide it by 7, and the REMAINDER of that
         division tells you the day of the week; 1 = Sunday, 2 = Monday, 3 =
         Tuesday, etc; BUT, if the remainder is 0, then the day is Saturday,
         that is: 0 = Saturday.
         */

        let month = this.month;
        let year = this._year;

        if (3 > month) {
            month += 12;
            year--;
        }

        const N = this.day + 2 * month + ~~(3 * (month + 1) / 5) + year + ~~(year / 4) - ~~(year / 100) + ~~(year / 400) + 2;

        return (N + 5) % 7 + 1;
    }

    /**
     * Gets the first weekday of the _year.
     * 1 = Monday, 7 = Sunday
     *
     * @returns {int}
     */
    get firstDayOfYear() {
        const y = this._year - 1;

        return (37 + y + ~~(y / 4) - ~~(y / 100) + ~~(y / 400) + 5) % 7 + 1;
    }

    /**
     * Gets the day no. in the _year.
     *
     * @returns {int}
     */
    get yearDay() {
        const target = daysPerMonth[this.leap ? 1 : 0];
        const months = target.slice(0, this.month - 1);

        return months.reduce((acc, val) => acc + val, 0) + this.day;
    }

    /**
     * Gets the ISO week number.
     *
     * @returns {int}
     */
    get isoWeekNumber() {
        let w = ~~((this.yearDay - this.weekDay + 10) / 7);

        if (1 > w) {
            w += 52;
        }

        return w;
    }

    /**
     * Gets the ISO-week _year.
     *
     * @returns {int}
     */
    get isoYear() {
        const target = this.copy();
        target._addDays(-target.weekDay + 3);

        return target._year;
    }

    /**
     * Is this tm representing a leap _year?
     *
     * @returns {boolean}
     */
    get leap() {
        return (0 === this._year % 4) && (0 !== this._year % 100 || 0 === this._year % 400);
    }

    /**
     * Gets the number of days in the current month.
     *
     * @returns {int}
     */
    get daysInMonth() {
        return daysPerMonth[this.leap][this.month - 1];
    }

    /**
     * Gets meridian (am/pm).
     *
     * @returns {string}
     */
    get meridian() {
        return 12 > this._hour ? 'am' : 'pm';
    }

    /**
     * Gets the number of days from epoch.
     *
     * @returns {int}
     */
    get daysFromEpoch() {
        let y = this._year;
        const m = this.month;
        const d = this.day;

        y -= 2 >= m ? 1 : 0;

        const era = ~~((0 <= y ? y : y-399) / 400);
        const yoe = Math.abs(y - era * 400);
        const doy = ~~((153 * (m + (2 < m ? -3 : 9)) + 2)/5) + d-1;
        const doe = yoe * 365 + ~~(yoe/4) - ~~(yoe/100) + doy;

        return era * 146097 + doe - 719468;
    }

    /**
     * Sets the number of days from epoch.
     *
     * @param {int} days
     */
    set daysFromEpoch(days) {
        const z = days + 719468;
        const era = ~~((0 <= z ? z : z - 146096) / 146097);
        const doe = Math.abs(z - era * 146097);
        const yoe = ~~((doe - ~~(doe/1460) + ~~(doe/36524) - ~~(doe/146096)) / 365);

        this._year = yoe + era * 400;
        const doy = Math.abs(doe - (365*yoe + ~~(yoe/4) - ~~(yoe/100)));
        const mp = ~~((5 * doy + 2)/153);
        this._day = doy - ~~((153 * mp + 2)/5) + 1;
        this._month = mp + (10 > mp ? 3 : -9);

        if (2 >= this._month) {
            this._year++;
        }
    }

    /**
     * Gets the unix timestamp for this tm.
     *
     * @returns {int}
     */
    get unixTimestamp() {
        return this._unixTime;
    }

    /**
     * Sets the unix timestamp for this tm.
     *
     * @param {int} timestamp
     */
    set unixTimestamp(timestamp) {
        this._unixTime = ~~timestamp;
        this._milliseconds = 0;
        this._updateTime();
    }

    /**
     * Gets the swatch internet time.
     *
     * @see https://en.wikipedia.org/wiki/Swatch_Internet_Time
     *
     * @returns {int}
     */
    get swatchInternetTime() {
        const utc1 = (this.unixTimestamp + 3600) % 86400;

        return ~~(utc1 / 86.4);
    }

    /**
     * Is this datetime valid?
     *
     * @returns {boolean}
     */
    get valid() {
        const days_in_month = daysPerMonth[this.leap ? 1 : 0][this.month - 1];

        return this.day <= days_in_month;
    }

    /**
     * Adds a timespan.
     *
     * @param {Jymfony.Component.DateTime.TimeSpan} timespan
     */
    add(timespan) {
        this._addMilliseconds((timespan.inverse ? -1 : 1) * timespan.milliseconds);
        this._addSeconds((timespan.inverse ? -1 : 1) * (
            timespan.seconds +
            timespan.minutes * 60 +
            timespan.hours * 3600
        ));
        this._addDays((timespan.inverse ? -1 : 1) * timespan.days);
        this._addMonths((timespan.inverse ? -1 : 1) * timespan.months);
        this._addYears((timespan.inverse ? -1 : 1) * timespan.years);
    }

    /**
     * Clones this object.
     */
    copy() {
        const retVal = new TimeDescriptor(this.timeZone.name);

        retVal.unixTimestamp = this.unixTimestamp;

        return retVal;
    }

    /**
     * Gets the wall clock timestamp for this tm.
     *
     * @returns {int}
     */
    get _wallClockTimestamp() {
        return this.daysFromEpoch * 86400 + this._hour * 3600 + this._minutes * 60 + this._seconds;
    }

    /**
     * Use a Date object to populate this struct.
     *
     * @param {Date} date
     *
     * @private
     */
    _fromDate(date) {
        this._milliseconds = date.getMilliseconds(); /* Milliseconds */
        this._seconds = date.getSeconds(); /* Seconds */
        this._minutes = date.getMinutes(); /* Minutes */
        this._hour = date.getHours(); /* Hours */
        this._day = date.getDate(); /* Day of the month */
        this._month = date.getMonth() + 1; /* Month */
        this._year = date.getFullYear(); /* Year */

        this._makeTime();
    }

    /**
     * @private
     */
    _makeTime() {
        const wallTimestamp = this._wallClockTimestamp;
        const offset = this.timeZone._getOffsetForWallClock(wallTimestamp);

        this._unixTime = wallTimestamp - offset;
    }

    /**
     * @private
     */
    _updateTime() {
        const wall_ts = this._unixTime + this.timeZone.getOffset(this._unixTime);

        this._seconds = wall_ts % 60;
        this._minutes = ~~((wall_ts % 3600 - this._seconds) / 60);
        this._hour = ~~((wall_ts % 86400 - (this._minutes % 3600)) / 3600);

        this.daysFromEpoch = ~~(wall_ts / 86400);
    }

    /**
     * @param {int} milliseconds
     *
     * @private
     */
    _addMilliseconds(milliseconds) {
        milliseconds = ~~milliseconds;

        if (! milliseconds) {
            return;
        }

        this._milliseconds += milliseconds;

        this._addSeconds(~~(this._milliseconds / 1000));
        this._milliseconds %= 1000;
    }

    /**
     * @param {int} seconds
     *
     * @private
     */
    _addSeconds(seconds) {
        seconds = ~~seconds;

        if (! seconds) {
            return;
        }

        this._unixTime += seconds;
        this._updateTime();
    }

    /**
     * @param {int} days
     *
     * @private
     */
    _addDays(days) {
        days = ~~days;

        if (! days) {
            return;
        }

        this._day += days;
        const month = () => 1 <= this._month ? this._month - 1 : 11;

        while (this._day >= daysPerMonth[this.leap ? 1 : 0][month()]) {
            this._day -= daysPerMonth[this.leap ? 1 : 0][month()];
            this._addMonths(1);
        }

        while (1 > this._day) {
            let m = month();
            m = 0 === m ? 11 : m - 1;

            this._day += daysPerMonth[this.leap ? 1 : 0][m];
            this._addMonths(-1);
        }
    }

    /**
     * @param {int} months
     *
     * @private
     */
    _addMonths(months) {
        months = ~~months;

        if (! months) {
            return;
        }

        const month = () => 1 < this._month ? this._month - 1 : 11;
        this._month += months;

        while (12 < this._month) {
            this._month -= 12;
            this._addYears(1);
        }

        while (1 > this._month) {
            this._month += 12;
            this._addYears(-1);
        }

        if (this._day > daysPerMonth[this.leap ? 1 : 0][month()]) {
            this._day = daysPerMonth[this.leap ? 1 : 0][month()];
        }
    }

    /**
     * @param {int} years
     *
     * @private
     */
    _addYears(years) {
        years = ~~years;

        if (! years) {
            return;
        }

        const month = () => 1 < this._month ? this._month - 1 : 11;
        this._year += years;

        if (this._day > daysPerMonth[this.leap ? 1 : 0][month()]) {
            this._day = daysPerMonth[this.leap ? 1 : 0][month()];
        }
    }
}
