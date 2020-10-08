const ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
const PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;

/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
export default class Year extends implementationOf(ConstraintInterface, PeriodInterface) {
    /**
     * @inheritdoc
     */
    get range() {
        return 31556900;
    }

    /**
     * @inheritdoc
     */
    val(d) {
        return d.year;
    }

    /**
     * @inheritdoc
     */
    isValid(d, val) {
        return d.year === val;
    }

    /**
     * @inheritdoc
     */
    extent() {
        return [ 1970, 9999 ];
    }

    /**
     * @inheritdoc
     */
    start(d) {
        return d.setDate(d.year, 1, 1).setTime(0, 0, 0);
    }

    /**
     * @inheritdoc
     */
    end(d) {
        return d.setDate(d.year, 12, 31).setTime(23, 59, 59);
    }

    /**
     * @inheritdoc
     */
    next(d, val) {
        return d.setDate(val, 1, 1).setTime(0, 0, 0);
    }
}
