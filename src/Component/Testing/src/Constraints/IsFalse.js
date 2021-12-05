const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that accepts true.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class IsFalse extends Constraint {
    /**
     * @inheritdoc
     */
    toString() {
        return 'is false';
    }

    /**
     * @inheritdoc
     */
    matches(other) {
        return false === other;
    }
}
