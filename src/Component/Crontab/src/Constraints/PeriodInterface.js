/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
class PeriodInterface {
    /**
     * Returns the start of the day.
     *
     * @param {Jymfony.Component.DateTime.DateTime} d
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    start(d) { }

    /**
     * Returns the end of the day.
     *
     * @param {Jymfony.Component.DateTime.DateTime} d
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    end(d) { }

    /**
     * Returns the start of the next instance of the day value indicated. Returns
     * the first day of the next month if val is greater than the number of
     * days in the following month.
     *
     * @param {Jymfony.Component.DateTime.DateTime} d The starting date
     * @param {int} val The desired value, must be within extent
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     */
    next(d, val) { }
}

export default getInterface(PeriodInterface);
