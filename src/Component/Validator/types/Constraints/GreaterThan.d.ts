declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

    export class GreaterThan extends AbstractComparison {
        public static readonly TOO_LOW_ERROR: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<GreaterThan>): this;
        constructor(options?: null | ConstraintOptions<GreaterThan>);
    }
}
