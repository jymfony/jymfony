declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

    export class GreaterThanOrEqual extends AbstractComparison {
        public static readonly TOO_LOW_ERROR: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<GreaterThanOrEqual>): this;
        constructor(options?: null | ConstraintOptions<GreaterThanOrEqual>);
    }
}
