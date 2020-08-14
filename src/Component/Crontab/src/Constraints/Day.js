const ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
const Month = Jymfony.Component.Crontab.Constraints.Month;
const PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

const DAYS_IN_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const SEC = new TimeSpan('PT1S');

/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
export default class Day extends implementationOf(ConstraintInterface, PeriodInterface) {
    /**
     * @inheritdoc
     */
    get range() {
        return 86400;
    }

    /**
     * @inheritdoc
     */
    val(d) {
        return d.day;
    }

    /**
     * @inheritdoc
     */
    isValid(d, val) {
        return d.day === (val || this.extent(d)[1]);
    }

    /**
     * @inheritdoc
     */
    extent(d) {
        const month = d.month;
        let max = DAYS_IN_MONTH[month - 1];

        if(2 === month && d.isLeapYear) {
            ++max;
        }

        return [ 1, max ];
    }

    /**
     * @inheritdoc
     */
    start(d) {
        return d.setTime(0, 0, 0);
    }

    /**
     * @inheritdoc
     */
    end(d) {
        return d.setTime(23, 59, 59);
    }

    /**
     * @inheritdoc
     */
    next(d, val) {
        val = val > this.extent(d)[1] ? 1 : val;

        const month = this._nextRollover(d, val);
        const DMax = this.extent(month)[1];

        val = val > DMax ? 1 : val || DMax;

        return month.setDate(month.year, month.month, val);
    }

    /**
     * @param {Jymfony.Component.DateTime.DateTime} d
     * @param {int} val
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     *
     * @private
     */
    _nextRollover(d, val) {
        const cur = this.val(d);
        const max = this.extent(d)[1];
        const period = new Month();

        if (((val || max) <= cur) || val > max) {
            return period.end(d).modify(SEC);
        }

        return period.start(d);
    }
}
