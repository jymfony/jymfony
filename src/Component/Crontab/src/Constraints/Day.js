import { DAYS_IN_MONTH } from './days_in_month';
import { nextRollover } from './next_rollover';

const ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
const Month = Jymfony.Component.Crontab.Constraints.Month;
const PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;

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

        const month = nextRollover(d, val, this, new Month());
        const DMax = this.extent(month)[1];

        val = val > DMax ? 1 : val || DMax;

        return month.setDate(month.year, month.month, val);
    }
}
