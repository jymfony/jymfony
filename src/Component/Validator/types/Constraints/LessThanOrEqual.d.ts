declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

    export class LessThanOrEqual extends AbstractComparison {
        public static readonly TOO_HIGH_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<LessThanOrEqual>): this;
        constructor(options?: null | ConstraintOptions<LessThanOrEqual>);
    }
}
