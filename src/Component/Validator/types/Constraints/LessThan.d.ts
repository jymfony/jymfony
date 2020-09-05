declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
    import ConstraintOptions = Jymfony.Component.Validator.ConstraintOptions;

    export class LessThan extends AbstractComparison {
        public static readonly TOO_HIGH_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<LessThan>): this;
        constructor(options?: null | ConstraintOptions<LessThan>);
    }
}
