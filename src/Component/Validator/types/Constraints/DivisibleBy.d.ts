declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

    export class DivisibleBy extends AbstractComparison {
        public static readonly NOT_DIVISIBLE_BY: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<DivisibleBy>): this;
        constructor(options?: null | ConstraintOptions<DivisibleBy>);
    }
}
