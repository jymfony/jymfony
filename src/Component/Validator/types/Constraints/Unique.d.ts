declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Unique extends Constraint {
        public static readonly IS_NOT_UNIQUE: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Unique>): this;
        constructor(options?: null | ConstraintOptions<Unique>);
    }
}
