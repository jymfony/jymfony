declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that checks whether a variable is empty.
     */
    export class IsEmpty extends Constraint {
        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        matches(other: any): boolean;

        /**
         * Returns the description of the failure
         *
         * The beginning of failure messages is "Failed asserting that" in most
         * cases. This method should return the second part of that sentence.
         *
         * @param other evaluated value or object
         */
        protected _failureDescription(other: any): string;
    }
}
