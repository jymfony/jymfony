const ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
const PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
export default class Second extends implementationOf(ConstraintInterface, PeriodInterface) {
    /**
     * @inheritdoc
     */
    get range() {
        return 1;
    }

    /**
     * @inheritdoc
     */
    val(d) {
        return d.second;
    }

    /**
     * @inheritdoc
     */
    isValid(d, val) {
        return d.second === val;
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
        return d;
    }

    /**
     * @inheritdoc
     */
    end(d) {
        return d;
    }

    /**
     * @inheritdoc
     */
    next(d, val) {
        const s = d.second;
        const inc = 59 < val ? 60 - s : (val <= s ? 60 - s + val : val - s);

        return d.modify(new TimeSpan('PT' + inc + 'S'));
    }
}
