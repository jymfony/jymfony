declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Range extends Constraint {
        public static readonly INVALID_CHARACTERS_ERROR: string;
        public static readonly NOT_IN_RANGE_ERROR: string;
        public static readonly TOO_HIGH_ERROR: string;
        public static readonly TOO_LOW_ERROR: string;

        public notInRangeMessage: string;
        public minMessage: string;
        public maxMessage: string;
        public invalidMessage: string;
        public min?: any;
        public minPropertyPath?: string;
        public max?: any;
        public maxPropertyPath?: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Range>): this;
        constructor(options?: null | ConstraintOptions<Range>);
    }
}
