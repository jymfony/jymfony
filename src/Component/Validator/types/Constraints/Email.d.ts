declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Email extends Constraint {
        public static readonly INVALID_FORMAT_ERROR: string;
        public static readonly VALIDATION_MODE_HTML5: string;
        public static readonly VALIDATION_MODE_STRICT: string;
        public static readonly VALIDATION_MODE_LOOSE: string;
        public static readonly validationModes: string[];

        public message: string;
        public mode?: string;
        public normalizer?: (value: string) => string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: ConstraintOptions<Email>): this;
        constructor(options?: ConstraintOptions<Email>);
    }
}
