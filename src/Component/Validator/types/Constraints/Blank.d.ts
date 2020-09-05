declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Blank extends Constraint {
        public static readonly NOT_BLANK_ERROR: string;

        message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Blank>): this;
        constructor(options?: null | ConstraintOptions<Blank>);
    }
}
