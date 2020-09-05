declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

    export class NotEqualTo extends AbstractComparison {
        public static readonly IS_EQUAL_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<NotEqualTo>): this;
        constructor(options?: null | ConstraintOptions<NotEqualTo>);
    }
}
