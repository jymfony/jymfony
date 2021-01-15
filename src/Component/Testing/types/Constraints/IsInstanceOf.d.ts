declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that asserts that the object it is evaluated for is an instance
     * of a given class.
     *
     * The expected class name is passed in the constructor.
     *
     * @final
     */
    export class IsInstanceOf extends Constraint {
        private _class: Newable<any, object>;
        private _className: string;

        __construct(className: Function | string): void;
        constructor(className: Function | string);

        /**
         * Returns a string representation of the constraint.
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        matches(other: any): boolean;

        /**
         * @inheritdoc
         */
        protected _failureDescription(other: any): string;

        private _getType(): string;
    }
}
