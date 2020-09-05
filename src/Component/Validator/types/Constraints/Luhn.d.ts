declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Luhn extends Constraint {
        public static readonly INVALID_CHARACTERS_ERROR: string;
        public static readonly CHECKSUM_FAILED_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Luhn>): this;
        constructor(options?: null | ConstraintOptions<Luhn>);
    }
}

