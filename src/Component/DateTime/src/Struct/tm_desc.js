const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;

const DEFAULT_TZ = process.env.TZ || 'Etc/UTC';
const daysPerMonth = [
    [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
    [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
];

/**
 * @memberOf Jymfony.Component.DateTime.Struct
 * @type tm_desc
 *
 * @internal
 */
class tm_desc {
    constructor(tz = undefined) {
        if (undefined === tz) {
            tz = DEFAULT_TZ;
        }

        /**
         * @type {DateTimeZone}
         */
        this.tm_tz = DateTimeZone.get(tz);
        let d = new Date();
        this.unix_timestamp = ~~(d.getTime() / 1000);
        this._tm_msec = d.getMilliseconds();
    }

    /**
     * Sets the year in short version (70-69 = 1970-2069)
     *
     * @param {number} year
     */
    set short_year(year) {
        year = ~~year;
        if (0 > year || 99 < year) {
            throw new InvalidArgumentException('Short year cannot be greater than 99 or less than 0');
        }

        if (70 > year) {
            this.tm_year = 2000 + year;
        } else {
            this.tm_year = 1900 + year;
        }

        this._makeTime();
    }

    /**
     * Gets the day.
     *
     * @returns {number}
     */
    get tm_mday() {
        return this._tm_mday;
    }

    /**
     * Sets the day.
     *
     * @param {number} day
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set tm_mday(day) {
        day = ~~day;
        if (1 > day || 31 < day) {
            throw new InvalidArgumentException('Cannot set day greater than 31 or less than 1');
        }

        this._tm_mday = day;
        this._makeTime();
    }

    /**
     * Gets the month.
     *
     * @returns {number}
     */
    get tm_mon() {
        return this._tm_mon;
    }

    /**
     * Sets the month.
     *
     * @param {number} month
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set tm_mon(month) {
        month = ~~month;
        if (1 > month || 12 < month) {
            throw new InvalidArgumentException('Cannot set month greater than 12 or less than 1');
        }

        this._tm_mon = month;
        this._makeTime();
    }

    /**
     * Get the seconds.
     *
     * @returns {number}
     */
    get tm_sec() {
        return this._tm_sec;
    }

    /**
     * Set the seconds.
     *
     * @param {number} sec
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set tm_sec(sec) {
        sec = ~~sec;
        if (0 > sec || 59 < sec) {
            throw new InvalidArgumentException('Cannot set seconds greater than 59 or less than 0');
        }

        this._tm_sec = sec;
        this._makeTime();
    }

    /**
     * Get the milliseconds.
     *
     * @returns {number}
     */
    get tm_msec() {
        return this._tm_msec;
    }

    /**
     * Set the milliseconds.
     *
     * @param {number} msec
     */
    set tm_msec(msec) {
        this._tm_msec = ~~msec.toString().substr(0, 3);
    }

    /**
     * Get the seconds.
     *
     * @returns {number}
     */
    get tm_min() {
        return this._tm_min;
    }

    /**
     * Set the minutes.
     *
     * @param {number} min
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set tm_min(min) {
        min = ~~min;
        if (0 > min || 59 < min) {
            throw new InvalidArgumentException('Cannot set minute greater than 59 or less than 0');
        }

        this._tm_min = min;
        this._makeTime();
    }

    /**
     * Get the hour.
     *
     * @returns {number}
     */
    get tm_hour() {
        return this._tm_hour;
    }

    /**
     * Set the hour.
     *
     * @param {number} hour
     * @throws {InvalidArgumentException} If trying to set an invalid value
     */
    set tm_hour(hour) {
        hour = ~~hour;
        if (23 < hour || 0 > hour) {
            throw new InvalidArgumentException('Cannot set hour greater than 23 or less than 0');
        }

        this._tm_hour = hour;
        this._makeTime();
    }

    /**
     * Gets the week day.
     * 1 = Monday, 7 = Sunday
     *
     * @returns {int}
     */
    get tm_wday() {
        /*
         Here is a formula for finding the day of the week for ANY date.

         N = d + 2m + [3(m+1)/5] + y + [y/4] - [y/100] + [y/400] + 2

         where d is the number or the day of the month, m is the number of the
         month, and y is the year. The brackets around the divisions mean to
         drop the remainder and just use the integer part that you get.

         Also, a VERY IMPORTANT RULE is the number to use for the months for
         January and February. The numbers of these months are 13 and 14 of the
         PREVIOUS YEAR. This means that to find the day of the week of New
         Year's Day this year, 1/1/98, you must use the date 13/1/97. (It
         sounds complicated, but I will do a couple of examples for you.)

         After you find the number N, divide it by 7, and the REMAINDER of that
         division tells you the day of the week; 1 = Sunday, 2 = Monday, 3 =
         Tuesday, etc; BUT, if the remainder is 0, then the day is Saturday,
         that is: 0 = Saturday.
         */

        let month = this.tm_mon;
        let year = this.tm_year;
        if (3 > month) {
            month += 12;
            year--;
        }

        let N = this.tm_mday + 2 * month + ~~(3 * (month + 1) / 5) + year + ~~(year / 4) - ~~(year / 100) + ~~(year / 400) + 2;
        return (N + 5) % 7 + 1;
    }

    /**
     * Gets the first weekday of the year.
     * 1 = Monday, 7 = Sunday
     *
     * @returns {int}
     */
    get first_day_of_year() {
        let y = this.tm_year - 1;
        return (37 + y + ~~(y / 4) - ~~(y / 100) + ~~(y / 400) + 5) % 7 + 1;
    }

    /**
     * Gets the day no. in the year.
     *
     * @returns {number}
     */
    get tm_yday() {
        let target = daysPerMonth[this.tm_leap ? 1 : 0];
        let months = target.slice(0, this.tm_mon - 1);

        return months.reduce((acc, val) => acc + val, 0) + this.tm_mday;
    }

    /**
     * Gets the ISO week number.
     *
     * @returns {number}
     */
    get tm_week() {
        let w = ~~((this.tm_yday - this.tm_wday + 10) / 7);
        if (1 > w) {
            w += 52;
        }

        return w;
    }

    /**
     * Gets the ISO-week year
     *
     * @returns {number|*}
     */
    get iso_year() {
        let target = this.copy();
        target._addDays(-target.tm_wday + 3);

        return target.tm_year;
    }

    /**
     * Is this tm representing a leap year?
     *
     * @returns {boolean}
     */
    get tm_leap() {
        return (0 === this.tm_year % 4) && (0 !== this.tm_year % 100 || 0 === this.tm_year % 400);
    }

    /**
     * Gets the number of days in the current month
     *
     * @returns {int}
     */
    get tm_dim() {
        return daysPerMonth[this.tm_leap][this.tm_mon - 1];
    }

    /**
     * Gets meridian (am/pm)
     *
     * @returns {string}
     */
    get tm_meridian() {
        return 12 > this._tm_hour ? 'am' : 'pm';
    }

    /**
     * Gets the number of days from epoch.
     *
     * @returns {number}
     */
    get days_from_epoch() {
        let y = this.tm_year;
        let m = this.tm_mon;
        let d = this.tm_mday;

        y -= 2 >= m ? 1 : 0;

        let era = ~~((0 <= y ? y : y-399) / 400);
        let yoe = Math.abs(y - era * 400);
        let doy = ~~((153 * (m + (2 < m ? -3 : 9)) + 2)/5) + d-1;
        let doe = yoe * 365 + ~~(yoe/4) - ~~(yoe/100) + doy;

        return era * 146097 + doe - 719468;
    }

    /**
     * @param {number} days
     */
    set days_from_epoch(days) {
        let z = days + 719468;
        let era = ~~((0 <= z ? z : z - 146096) / 146097);
        let doe = Math.abs(z - era * 146097);
        let yoe = ~~((doe - ~~(doe/1460) + ~~(doe/36524) - ~~(doe/146096)) / 365);

        this.tm_year = yoe + era * 400;
        let doy = Math.abs(doe - (365*yoe + ~~(yoe/4) - ~~(yoe/100)));
        let mp = ~~((5 * doy + 2)/153);
        this._tm_mday = doy - ~~((153 * mp + 2)/5) + 1;
        this._tm_mon = mp + (10 > mp ? 3 : -9);

        if (2 >= this._tm_mon) {
            this.tm_year++;
        }
    }

    /**
     * Gets the unix timestamp for this tm.
     *
     * @returns {number}
     */
    get unix_timestamp() {
        return this._unix_time;
    }

    /**
     * Sets the unix timestamp for this tm.
     *
     * @param {number} timestamp
     */
    set unix_timestamp(timestamp) {
        this._unix_time = ~~timestamp;
        this._tm_msec = 0;
        this._makeTm();
    }

    /**
     * Gets the swatch internet time
     *
     * @see https://en.wikipedia.org/wiki/Swatch_Internet_Time
     *
     * @returns {int}
     */
    get swatch_internet_time() {
        const utc1 = (this.unix_timestamp + 3600) % 86400;
        return ~~(utc1 / 86.4);
    }

    /**
     * Is this datetime valid?
     *
     * @returns {boolean}
     */
    get valid() {
        let days_in_month = daysPerMonth[this.tm_leap ? 1 : 0][this.tm_mon - 1];
        return this.tm_mday <= days_in_month;
    }

    /**
     * Adds a timespan
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
        const retVal = new tm_desc(this.tm_tz.name);

        retVal.unix_timestamp = this.unix_timestamp;
        return retVal;
    }

    /**
     * Gets the wall clock timestamp for this tm.
     *
     * @returns {number}
     */
    get _wallclock_timestamp() {
        return this.days_from_epoch * 86400 + this._tm_hour * 3600 + this._tm_min * 60 + this._tm_sec;
    }

    /**
     * Use a Date object to populate this struct.
     *
     * @param {Date} date
     * @private
     */
    _fromDate(date) {
        this._tm_msec = date.getMilliseconds(); /* Milliseconds */
        this._tm_sec = date.getSeconds();       /* Seconds */
        this._tm_min = date.getMinutes();       /* Minutes */
        this._tm_hour = date.getHours();        /* Hours */
        this._tm_mday = date.getDate();         /* Day of the month */
        this._tm_mon = date.getMonth() + 1;     /* Month */
        this.tm_year = date.getFullYear();      /* Year */

        this._makeTime();
    }

    _makeTime() {
        let wall_ts = this._wallclock_timestamp;
        let offset = this.tm_tz._getOffsetForWallClock(wall_ts);

        this._unix_time = wall_ts - offset;
    }

    _makeTm() {
        let wall_ts = this._unix_time + this.tm_tz.getOffset(this._unix_time);

        this._tm_sec = wall_ts % 60;
        this._tm_min = ~~((wall_ts % 3600 - this._tm_sec) / 60);
        this._tm_hour = ~~((wall_ts % 86400 - (this._tm_min % 3600)) / 3600);

        this.days_from_epoch = ~~(wall_ts / 86400);
    }

    _addMilliseconds(msecs) {
        this._tm_msec += msecs;

        this._addSeconds(~~(this._tm_msec / 1000));
        this._tm_msec %= 1000;
    }

    _addSeconds(secs) {
        this._unix_time += secs;
        this._makeTm();
    }

    _addDays(days) {
        this._tm_mday += days;
        const month = () => 1 < this._tm_mon ? this._tm_mon - 1 : 11;

        while (this._tm_mday >= daysPerMonth[this.tm_leap ? 1 : 0][month()]) {
            this._tm_mday -= daysPerMonth[this.tm_leap ? 1 : 0][month()];
            this._addMonths(1);
        }

        while (1 > this._tm_mday) {
            this._tm_mday += daysPerMonth[this.tm_leap ? 1 : 0][month()];
            this._addMonths(-1);
        }
    }

    _addMonths(months) {
        const month = () => 1 < this._tm_mon ? this._tm_mon - 1 : 11;
        this._tm_mon += months;

        while (12 < this._tm_mon) {
            this._tm_mon -= 12;
            this._addYears(1);
        }

        while (1 > this._tm_mon) {
            this._tm_mon += 12;
            this._addYears(-1);
        }

        if (this._tm_mday > daysPerMonth[this.tm_leap ? 1 : 0][month()]) {
            this._tm_mday = daysPerMonth[this.tm_leap ? 1 : 0][month()];
        }
    }

    _addYears(years) {
        const month = () => 1 < this._tm_mon ? this._tm_mon - 1 : 11;
        this.tm_year += years;

        if (this._tm_mday > daysPerMonth[this.tm_leap ? 1 : 0][month()]) {
            this._tm_mday = daysPerMonth[this.tm_leap ? 1 : 0][month()];
        }
    }
}

module.exports = tm_desc;
