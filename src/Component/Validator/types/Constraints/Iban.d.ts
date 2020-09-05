declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Iban extends Constraint {
        public static readonly INVALID_COUNTRY_CODE_ERROR: string;
        public static readonly INVALID_CHARACTERS_ERROR: string;
        public static readonly CHECKSUM_FAILED_ERROR: string;
        public static readonly INVALID_FORMAT_ERROR: string;
        public static readonly NOT_SUPPORTED_COUNTRY_CODE_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Iban>): this;
        constructor(options?: null | ConstraintOptions<Iban>);
    }
}
