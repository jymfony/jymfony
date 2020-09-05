declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class IsNull extends Constraint {
        public static readonly NOT_NULL_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<IsNull>): this;
        constructor(options?: null | ConstraintOptions<IsNull>);
    }
}
