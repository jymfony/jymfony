declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class IsTrue extends Constraint {
        public static readonly NOT_TRUE_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<IsTrue>): this;
        constructor(options?: null | ConstraintOptions<IsTrue>);
    }
}
