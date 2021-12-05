declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that accepts null.
     *
     * @final
     */
    export class IsUndefined extends Constraint {
        /**
         * Returns a string representation of the constraint.
         */
        toString(): string;

        /**
         * Evaluates the constraint for parameter $other. Returns true if the
         * constraint is met, false otherwise.
         *
         * @param other value or object to evaluate
         */
        matches(other: any): boolean;
    }
}
