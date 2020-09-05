declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

    export class EqualTo extends AbstractComparison {
        public static readonly NOT_EQUAL_ERROR: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<EqualTo>): this;
        constructor(options?: null | ConstraintOptions<EqualTo>);
    }
}
