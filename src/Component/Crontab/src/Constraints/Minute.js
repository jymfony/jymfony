const ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
const PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
export default class Minute extends implementationOf(ConstraintInterface, PeriodInterface) {
    /**
     * @inheritdoc
     */
    get range() {
        return 60;
    }

    /**
     * @inheritdoc
     */
    val(d) {
        return d.minute;
    }

    /**
     * @inheritdoc
     */
    isValid(d, val) {
        return d.minute === val;
    }

    /**
     * @inheritdoc
     */
    extent() {
        return [ 0, 59 ];
    }

    /**
     * @inheritdoc
     */
    start(d) {
        return d.setTime(d.hour, d.minute, 0);
    }

    /**
     * @inheritdoc
     */
    end(d) {
        return d.setTime(d.hour, d.minute, 59);
    }

    /**
     * @inheritdoc
     */
    next(d, val) {
        const m = d.minute;
        const inc = 59 < val ? 60 - m : (val <= m ? 60 - m + val : val - m);

        return d.setTime(d.hour, d.minute, 0).modify(new TimeSpan('PT' + inc + 'M'));
    }
}
