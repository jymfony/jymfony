declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class NotNull extends Constraint {
        public static readonly IS_NULL_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<NotNull>): this;
        constructor(options?: null | ConstraintOptions<NotNull>);
    }
}
