/**
 * @memberOf Jymfony.Component.Crontab.Constraints
 */
class ConstraintInterface {
    /**
     * Gets the constraint range (needed to order constraints).
     *
     * @returns {int}
     */
    get range() { }

    /**
     * Gets the value for this constraint.
     *
     * @param {Jymfony.Component.DateTime.DateTime} d
     *
     * @returns {int}
     */
    val(d) { }

    /**
     * Checks if the value is valid for the given date time.
     *
     * @param {Jymfony.Component.DateTime.DateTime} d
     * @param {int} val
     *
     * @returns {boolean}
     */
    isValid(d, val) { }

    /**
     * The minimum and maximum valid day values of the month specified.
     * Zero to specify the last day of the month.
     *
     * @param {Jymfony.Component.DateTime.DateTime} d The date indicating the month to find the extent of
     *
     * @returns [int, int]
     */
    extent(d) { }
}

export default getInterface(ConstraintInterface);
