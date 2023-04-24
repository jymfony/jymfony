declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that asserts that the string it is evaluated for matches
     * a given format.
     *
     * The pattern string passed in the constructor.
     */
    export class StringFormat extends Constraint {
        private _format: string;

        /**
         * Constructor.
         */
        __construct(format: string): void;
        constructor(format: string);

        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        matches(other: string): boolean;
    }
}
