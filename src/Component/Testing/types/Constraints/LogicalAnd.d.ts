declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Logical AND.
     *
     * @final
     */
    export class LogicalAnd extends Constraint {
        private _constraints: Constraint[];

        static fromConstraints(...constraints: Constraint[]): LogicalAnd;

        __construct(): void;
        constructor();

        /**
         * @param {Jymfony.Component.Testing.Constraints.Constraint[]} constraints
         */
        setConstraints(constraints: Constraint[]): void;

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
        public readonly length: number;
    }
}
