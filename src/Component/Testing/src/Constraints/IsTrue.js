const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that accepts true.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class IsTrue extends Constraint {
    /**
     * @inheritdoc
     */
    toString() {
        return 'is true';
    }

    /**
     * @inheritdoc
     */
    matches(other) {
        return true === other;
    }
}
