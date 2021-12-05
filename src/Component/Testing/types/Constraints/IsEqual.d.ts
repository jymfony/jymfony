declare namespace Jymfony.Component.Testing.Constraints {
    import ComparatorFactory = Jymfony.Component.Testing.Comparator.ComparatorFactory;
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that checks if one value is equal to another.
     *
     * Equality is checked with == operator.
     * Two values are equal if they have the same value disregarding type.
     *
     * The expected value is passed in the constructor.
     *
     * @final
     */
    export class IsEqual extends Constraint {
        private _value: any;
        private _delta: number;
        private _ignoreCase: boolean;
        private _comparatorFactory: ComparatorFactory;

        /**
         * Constructor.
         */
        __construct(value: any, delta?: number, ignoreCase?: boolean): void;
        constructor(value: any, delta?: number, ignoreCase?: boolean);

        public comparatorFactory: ComparatorFactory;

        /**
         * @inheritdoc
         */
        evaluate(other: any, description?: string, Throw?: boolean): boolean;

        /**
         * Returns a string representation of the constraint.
         */
        toString(): string;
    }
}
