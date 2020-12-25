const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that accepts null.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class IsUndefined extends Constraint {
    /**
     * Returns a string representation of the constraint.
     */
    toString() {
        return 'is undefined';
    }

    /**
     * Evaluates the constraint for parameter $other. Returns true if the
     * constraint is met, false otherwise.
     *
     * @param {*} other value or object to evaluate
     */
    matches(other) {
        return undefined === other;
    }
}
