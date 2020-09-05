declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Issn extends Constraint {
        public static readonly TOO_SHORT_ERROR: string;
        public static readonly TOO_LONG_ERROR: string;
        public static readonly MISSING_HYPHEN_ERROR: string;
        public static readonly INVALID_CHARACTERS_ERROR: string;
        public static readonly INVALID_CASE_ERROR: string;
        public static readonly CHECKSUM_FAILED_ERROR: string;

        public message: string;
        public caseSensitive: boolean;
        public requireHyphen: boolean;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Issn>): this;
        constructor(options?: null | ConstraintOptions<Issn>);
    }
}
