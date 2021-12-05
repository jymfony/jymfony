declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that asserts that the string it is evaluated for contains
     * a given string.
     *
     * Uses indexOf() to find the position of the string in the input, if not
     * found the evaluation fails.
     *
     * @final
     */
    export class StringContains extends Constraint {
        private _string: string;
        private _ignoreCase: boolean;

        /**
         * Constructor.
         */
        __construct(string: string, ignoreCase?: boolean): void;
        constructor(string: string, ignoreCase?: boolean);

        /**
         * Returns a string representation of the constraint.
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        matches(other: any): boolean;
    }
}
