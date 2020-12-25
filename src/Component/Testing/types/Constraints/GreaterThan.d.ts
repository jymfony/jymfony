declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that asserts that the value it is evaluated for is greater
     * than a given value.
     */
    export class GreaterThan extends Constraint {
        private _value: number;

        /**
         * Constructor.
         */
        __construct(value: number): void;
        constructor(value: number);

        /**
         * Returns a string representation of the constraint.
         */
        toString(): string;

        /**
         * Evaluates the constraint for parameter other. Returns true if the
         * constraint is met, false otherwise.
         *
         * @param other value or object to evaluate
         */
        matches(other: any): boolean;
    }
}
