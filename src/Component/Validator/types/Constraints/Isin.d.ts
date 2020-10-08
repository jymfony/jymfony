declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Isin extends Constraint {
        public static readonly VALIDATION_LENGTH: number;
        public static readonly VALIDATION_PATTERN: RegExp;
        public static readonly INVALID_LENGTH_ERROR: string;
        public static readonly INVALID_PATTERN_ERROR: string;
        public static readonly INVALID_CHECKSUM_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Isin>): this;
        constructor(options?: null | ConstraintOptions<Isin>);
    }
}
