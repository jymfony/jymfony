declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that asserts that one value is identical to another.
     *
     * Identical check is performed with the === operator.
     * Two values are identical if they have the same value and are of the same type.
     *
     * The expected value is passed in the constructor.
     *
     * @final
     */
    export class IsIdentical extends Constraint {
        private _value: any;

        /**
         * Constructor.
         *
         * @param {*} value
         */
        __construct(value: any): void;
        constructor(value: any);

        /**
         * @inheritdoc
         */
        evaluate(other: any, description?: string, Throw?: boolean): boolean;

        /**
         * Returns a string representation of the constraint.
         */
        toString(): string;

        /**
         * Returns the description of the failure
         *
         * The beginning of failure messages is "Failed asserting that" in most
         * cases. This method should return the second part of that sentence.
         *
         * @param {*} other evaluated value or object
         */
        protected _failureDescription(other: any): string;
    }
}
