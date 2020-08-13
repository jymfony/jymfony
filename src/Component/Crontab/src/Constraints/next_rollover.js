const TimeSpan = Jymfony.Component.DateTime.TimeSpan;
const SEC = new TimeSpan('PT1S');

/**
 * @param {Jymfony.Component.DateTime.DateTime} d
 * @param {int} val
 * @param {Jymfony.Component.Crontab.Constraints.ConstraintInterface} constraint
 * @param {Jymfony.Component.Crontab.Constraints.PeriodInterface} period
 *
 * @returns {Jymfony.Component.DateTime.DateTime}
 */
export const nextRollover = (d, val, constraint, period) => {
    const cur = constraint.val(d);
    const max = constraint.extent(d)[1];

    if (((val || max) <= cur) || val > max) {
        return period.end(d).modify(SEC);
    }

    return period.start(d);
};
