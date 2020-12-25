declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Logical NOT.
     *
     * @memberOf Jymfony.Component.Testing.Constraints
     * @final
     */
    export class LogicalNot extends Constraint {
        private _constraint: Constraint;

        private static negate(string: string): string;

        /**
         * Constructor.
         */
        __construct(constraint: Constraint | any): void;

        /**
         * @inheritdoc
         */
        evaluate(other: any, description?: string, Throw?: boolean): boolean;

        /**
         * Returns a string representation of the constraint.
         */
        toString(): string;

        /**
         * Counts the number of constraint elements.
         */
        readonly length: number;

        /**
         * @inheritdoc
         */
        protected _failureDescription(other: any): string;
    }
}
