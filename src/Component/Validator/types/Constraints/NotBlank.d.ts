declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class NotBlank extends Constraint {
        public static readonly IS_BLANK_ERROR: string;

        public message: string;
        public allowNull: boolean;
        public normalizer?: (arg: string) => string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<NotBlank>): this;
        constructor(options?: null | ConstraintOptions<NotBlank>);
    }
}
