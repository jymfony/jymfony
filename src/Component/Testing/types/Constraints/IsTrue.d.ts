declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that accepts true.
     *
     * @final
     */
    export class IsTrue extends Constraint {
        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        matches(other: any): other is true;
    }
}
