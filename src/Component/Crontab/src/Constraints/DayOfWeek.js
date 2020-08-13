const ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
const PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
export default class DayOfWeek extends implementationOf(ConstraintInterface, PeriodInterface) {
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
        return d.dayOfWeek;
    }

    /**
     * @inheritdoc
     */
    isValid(d, val) {
        return d.dayOfWeek === (val || 7);
    }

    /**
     * @inheritdoc
     */
    extent() {
        return [ 1, 7 ];
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
        let diff = 7;
        if (val > d.dayOfWeek) {
            diff = val - d.dayOfWeek;
        } else if (val < d.dayOfWeek) {
            diff = val + 7 - d.dayOfWeek;
        }

        return this.start(d).modify(new TimeSpan('P' + diff + 'D'));
    }
}
