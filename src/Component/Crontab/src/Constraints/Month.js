const ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
const PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

const PREV_SEC = new TimeSpan('P-T1S');
const NEXT_MONTH = new TimeSpan('P1M');
const NEXT_YEAR = new TimeSpan('P1Y');

/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
export default class Month extends implementationOf(ConstraintInterface, PeriodInterface) {
    /**
     * @inheritdoc
     */
    get range() {
        return 2629740;
    }

    /**
     * @inheritdoc
     */
    val(d) {
        return d.month;
    }

    /**
     * @inheritdoc
     */
    isValid(d, val) {
        return d.month === (val || 12);
    }

    /**
     * @inheritdoc
     */
    extent() {
        return [ 1, 12 ];
    }

    /**
     * @inheritdoc
     */
    start(d) {
        return d.setDate(d.year, d.month, 1).setTime(0, 0, 0);
    }

    /**
     * @inheritdoc
     */
    end(d) {
        return this.start(d).modify(NEXT_MONTH).modify(PREV_SEC);
    }

    /**
     * @inheritdoc
     */
    next(d, val) {
        val = 12 < val ? 1 : val || 12;
        if (val <= d.month) {
            d = d.modify(NEXT_YEAR);
        }

        return d.setDate(d.year, val, 1).setTime(0, 0, 0);
    }
}
