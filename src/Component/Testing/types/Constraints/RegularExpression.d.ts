declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that asserts that the string it is evaluated for matches
     * a regular expression.
     *
     * The pattern string passed in the constructor.
     */
    export class RegularExpression extends Constraint {
        private _regex: RegExp;

        /**
         * Constructor.
         */
        __construct(regex: RegExp): void;

        constructor(regex: RegExp);

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
