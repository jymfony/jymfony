const ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
const PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

const TOMORROW = new TimeSpan('P1D');

/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
export default class Hour extends implementationOf(ConstraintInterface, PeriodInterface) {
    /**
     * @inheritdoc
     */
    get range() {
        return 3600;
    }

    /**
     * @inheritdoc
     */
    val(d) {
        return d.hour;
    }

    /**
     * @inheritdoc
     */
    isValid(d, val) {
        return d.hour === val;
    }

    /**
     * @inheritdoc
     */
    extent() {
        return [ 0, 23 ];
    }

    /**
     * @inheritdoc
     */
    start(d) {
        return d.setTime(d.hour, 0, 0);
    }

    /**
     * @inheritdoc
     */
    end(d) {
        return d.setTime(d.hour, 59, 59);
    }

    /**
     * @inheritdoc
     */
    next(d, val) {
        val = 23 < val ? 0 : val;
        if (val <= d.hour) {
            d = d.modify(TOMORROW);
        }

        return d.setTime(val, 0, 0);
    }
}
