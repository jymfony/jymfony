declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Logical OR.
     *
     * @final
     */
    export class LogicalOr extends Constraint {
        private _constraints: Constraint[];

        static fromConstraints(...constraints: Constraint[]): LogicalOr;

        __construct(): void;
        constructor();

        setConstraints(constraints: (Constraint | any)[]): void;

        /**
         * @inheritdoc
         */
        evaluate(other: any, description?: string, returnResult?: boolean): boolean;

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
