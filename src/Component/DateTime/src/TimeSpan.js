const InvalidDateTimeStringException = Jymfony.Component.DateTime.Exception.InvalidDateTimeStringException;

/**
 * Represents a time interval.
 *
 * @memberOf Jymfony.Component.DateTime
 */
class TimeSpan {
    constructor(duration = undefined) {
        this._milliseconds = 0;
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;
        this._days = 0;
        this._months = 0;
        this._years = 0;

        this._inverse = false;

        if (undefined !== duration) {
            this._parse(duration);
        }
    }

    get inverse() {
        return this._inverse;
    }

    set inverse(inverse) {
        this._inverse = !! inverse;
    }

    get milliseconds() {
        return this._milliseconds;
    }

    set milliseconds(millis) {
        if (0 > millis || 1000 <= millis) {
            throw new InvalidArgumentException('Invalid value for milliseconds: ' + millis);
        }

        this._milliseconds = ~~millis;
    }

    get seconds() {
        return this._seconds;
    }

    set seconds(seconds) {
        if (0 > seconds || 60 <= seconds) {
            throw new InvalidArgumentException('Invalid value for seconds: ' + seconds);
        }

        this._seconds = ~~seconds;
    }

    get minutes() {
        return this._minutes;
    }

    set minutes(mins) {
        if (0 > mins || 60 <= mins) {
            throw new InvalidArgumentException('Invalid value for minutes: ' + mins);
        }

        this._minutes = ~~mins;
    }

    get hours() {
        return this._hours;
    }

    set hours(hours) {
        if (0 > hours || 23 <= hours) {
            throw new InvalidArgumentException('Invalid value for hours: ' + hours);
        }

        this._hours = ~~hours;
    }

    get days() {
        return this._days;
    }

    set days(days) {
        if (0 > days) {
            throw new InvalidArgumentException('Invalid value for days: ' + days);
        }

        this._days = ~~days;
    }

    get months() {
        return this._months;
    }

    set months(months) {
        if (0 > months) {
            throw new InvalidArgumentException('Invalid value for months: ' + months);
        }

        this._months = ~~months;
    }

    get years() {
        return this._years;
    }

    set years(years) {
        if (0 > years) {
            throw new InvalidArgumentException('Invalid value for years: ' + years);
        }

        this._years = ~~years;
    }

    _parse(isoDuration) {
        const regex = /^P([+\-])?(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        let matches = isoDuration.match(regex);

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

module.exports = TimeSpan;
