declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Isbn extends Constraint {
        public static readonly TOO_SHORT_ERROR: string;
        public static readonly TOO_LONG_ERROR: string;
        public static readonly INVALID_CHARACTERS_ERROR: string;
        public static readonly CHECKSUM_FAILED_ERROR: string;
        public static readonly TYPE_NOT_RECOGNIZED_ERROR: string;

        public isbn10Message: string;
        public isbn13Message: string;
        public bothIsbnMessage: string;
        public type?: string;
        public message?: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Isbn>): this;
        constructor(options?: null | ConstraintOptions<Isbn>);

        public readonly defaultOption: string;
    }
}
