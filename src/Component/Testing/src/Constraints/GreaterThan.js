const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that asserts that the value it is evaluated for is greater
 * than a given value.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 */
export default class GreaterThan extends Constraint {
    /**
     * Constructor.
     *
     * @param {float|int} value
     */
    __construct(value) {
        /**
         * @type {float|int}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * Returns a string representation of the constraint.
     */
    toString() {
        return 'is greater than ' + this.export(this._value);
    }

    /**
     * Evaluates the constraint for parameter other. Returns true if the
     * constraint is met, false otherwise.
     *
     * @param {*} other value or object to evaluate
     */
    matches(other) {
        return this._value < other;
    }
}
