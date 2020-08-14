const Crontab = Jymfony.Component.Crontab.Crontab;
const DateTime = Jymfony.Component.DateTime.DateTime;

const CONSTRAINTS = {
    s: [ 0, 0, 59 ], // Seconds
    m: [ 1, 0, 59 ], // Minutes
    h: [ 2, 0, 23 ], // Hours
    D: [ 3, 1, 31 ], // Day of month
    M: [ 4, 1, 12 ], // Month
    d: [ 5, 0, 7 ], // Day of week
    Y: [ 6, 1970, 9999 ], // Year
};

const NAMES = {
    JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8,
    SEP: 9, OCT: 10, NOV: 11, DEC: 12,
    SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};

const REPLACEMENTS = {
    '* * * * * *': '* * * * *',
    '@YEARLY': '0 0 1 1 *',
    '@ANNUALLY': '0 0 1 1 *',
    '@MONTHLY': '0 0 1 * *',
    '@WEEKLY': '0 0 * * 0',
    '@DAILY': '0 0 * * *',
    '@HOURLY': '0 * * * *',
};

/**
 * Returns true if the item is either of the form x#y or xL.
 *
 * @param {string} item The expression item to check
 */
const isHash = item => -1 < item.indexOf('#') || 0 < item.indexOf('L');
const itemSorter = (a, b) => isHash(a) && ! isHash(b) ? 1 : a - b;

/**
 * @memberOf Jymfony.Component.Crontab
 */
export default class Parser {
    /**
     * Parses a cron expression.
     *
     * @param {string} expr
     * @param {Jymfony.Component.DateTime.DateTime} now
     *
     * @returns {Jymfony.Component.Crontab.Crontab}
     */
    parse(expr, now = DateTime.now) {
        expr = expr.toUpperCase();

        return new Crontab(this._parseExpr(REPLACEMENTS[expr] || expr), now);
    }

    /**
     * Returns the value + offset if value is a number, otherwise it
     * attempts to look up the value in the NAMES table and returns
     * that result instead.
     *
     * @param {int|string} value The value that should be parsed
     * @param {int} [max = 9999] The maximum possible value
     *
     * @private
     */
    _getValue(value, max= 9999) {
        return ! isNumeric(value) ? (undefined !== NAMES[value] ? NAMES[value] : null) : Math.min(~~value, max);
    }

    /**
     * Adds values to the specified constraint in the current schedule.
     *
     * @param {Object.<string, *>} schedule The schedule to add the constraint to
     * @param {string} name Name of constraint to add
     * @param {int} min Minimum value for this constraint
     * @param {int} max Maximum value for this constraint
     * @param {int} [inc = 1] The increment to use between min and max
     *
     * @private
     */
    _add(schedule, name, min, max, inc = 1) {
        let i = min;

        if (!schedule[name]) {
            schedule[name] = [];
        }

        while (i <= max) {
            if (0 > schedule[name].indexOf(i)) {
                schedule[name].push(i);
            }

            i += inc;
        }

        schedule[name].sort((a, b) => a - b);
    }

    /**
     * Adds a hash item (of the form x#y or xL) to the schedule.
     *
     * @param {Object.<string, *>} schedules The current schedule array to add to
     * @param {Object.<string, *>} curSchedule The current schedule to add to
     * @param {int} value The value to add (x of x#y or xL)
     * @param {int} hash The hash value to add (y of x#y)
     */
    _addHash(schedules, curSchedule, value, hash) {
        // If there are any existing day of week constraints that
        // Aren't equal to the one we're adding, create a new
        // Composite schedule
        if ((curSchedule.d && !curSchedule.dc) ||
            (curSchedule.dc && 0 > curSchedule.dc.indexOf(hash))) {
            schedules.push(__jymfony.deepClone(curSchedule));
            curSchedule = schedules[schedules.length-1];
        }

        this._add(curSchedule, 'd', value, value);
        this._add(curSchedule, 'dc', hash, hash);
    }

    _addWeekday(s, curSchedule, value) {
        const except1 = {}, except2 = {};
        if (1 === value) {
            // Cron doesn't pass month boundaries, so if 1st is a
            // Weekend then we need to use 2nd or 3rd instead
            this._add(curSchedule, 'D', 1, 3);
            this._add(curSchedule, 'd', NAMES.MON, NAMES.FRI);
            this._add(except1, 'D', 2, 2);
            this._add(except1, 'd', NAMES.TUE, NAMES.FRI);
            this._add(except2, 'D', 3, 3);
            this._add(except2, 'd', NAMES.TUE, NAMES.FRI);
        } else {
            // Normally you want the closest day, so if v is a
            // Saturday, use the previous Friday.  If it's a
            // Sunday, use the following Monday.
            this._add(curSchedule, 'D', value-1, value+1);
            this._add(curSchedule, 'd', NAMES.MON, NAMES.FRI);
            this._add(except1, 'D', value-1, value-1);
            this._add(except1, 'd', NAMES.MON, NAMES.THU);
            this._add(except2, 'D', value+1, value+1);
            this._add(except2, 'd', NAMES.TUE, NAMES.FRI);
        }

        s.exceptions.push(except1);
        s.exceptions.push(except2);
    }

    /**
     * Adds a range item (of the form x-y/z) to the schedule.
     *
     * @param {string} item The cron expression item to add
     * @param {Object.<string, *>} curSchedule The current schedule to add to
     * @param {string} name The name to use for this constraint
     * @param {int} min The min value for the constraint
     * @param {int} max The max value for the constraint
     */
    _addRange(item, curSchedule, name, min, max) {
        // Parse range/x
        const [ range, inc ] = item.split('/');

        // Parse x-y or * or 0
        if ('*' !== range && '0' !== range) {
            const rangeSplit = range.split('-');
            min = this._getValue(rangeSplit[0], max);

            // Range may be single digit
            max = this._getValue(rangeSplit[1], max) || max;
        }

        this._add(curSchedule, name, min, max, undefined !== inc ? ~~inc : undefined);
    }

    /**
     * Parses a particular item within a cron expression.
     *
     * @param {string|int} item The cron expression item to parse
     * @param {Object.<string, *>} s The existing set of schedules
     * @param {string} name The name to use for this constraint
     * @param {int} min The min value for the constraint
     * @param {int} max The max value for the constraint
     */
    _doParse(item, s, name, min, max) {
        let value, split;
        const schedules = s.schedules;
        const curSchedule = schedules[schedules.length-1];

        // L just means min - 1 (this also makes it work for any field)
        if ('L' === item) {
            item = min - 1;
        }

        // Parse x
        if (null !== (value = this._getValue(item, max))) {
            this._add(curSchedule, name, value, value);
        } else if (null !== (value = this._getValue(item.replace('W', ''), max))) {
            this._addWeekday(s, curSchedule, value);
        } else if (null !== (value = this._getValue(item.replace('L', ''), max))) {
            this._addHash(schedules, curSchedule, value, min-1);
        } else if (2 === (split = item.split('#')).length) {
            value = this._getValue(split[0], max);
            this._addHash(schedules, curSchedule, value, this._getValue(split[1]));
        } else {
            this._addRange(item, curSchedule, name, min, max);
        }
    }


    /**
     * Parses each of the fields in a cron expression.  The expression must
     * include the seconds field, the year field is optional.
     *
     * @param {string} expr The cron expression to parse
     *
     * @private
     */
    _parseExpr(expr) {
        const schedule = { schedules: [ {} ], exceptions: [] };
        const components = expr.replace(/(\s)+/g, ' ').split(' ');

        for (const [ key, field ] of __jymfony.getEntries(CONSTRAINTS)) {
            const component = components[field[0]];
            if (! component || '*' === component || '?' === component) {
                continue;
            }

            // Need to sort so that any #'s come last, otherwise
            // Schedule clones to handle # won't contain all of the
            // Other constraints
            const items = component.split(',').sort(itemSorter);
            for (let i = 0; i < items.length; i++) {
                this._doParse(items[i], schedule, key, field[1], field[2]);
            }
        }

        return schedule;
    }
}
