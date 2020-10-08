declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class IsFalse extends Constraint {
        public static readonly NOT_FALSE_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<IsFalse>): this;
        constructor(options?: null | ConstraintOptions<IsFalse>);
    }
}
