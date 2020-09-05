declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Count extends Constraint {
        public static readonly TOO_FEW_ERROR: string;
        public static readonly TOO_MANY_ERROR: string;
        public static readonly NOT_DIVISIBLE_BY_ERROR: string;

        public minMessage: string;
        public maxMessage: string;
        public exactMessage: string;
        public divisibleByMessage: string;
        public min?: number;
        public max?: number;
        public divisibleBy?: number;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        __construct(options?: null | ConstraintOptions<Count>): this;
        constructor(options?: null | ConstraintOptions<Count>);
    }
}
