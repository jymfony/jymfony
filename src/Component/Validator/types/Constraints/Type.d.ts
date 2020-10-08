declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Type extends Constraint {
        public readonly INVALID_TYPE_ERROR: string;

        public message: string;
        public type: string | AnyConstructorRaw;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Type>): this;
        constructor(options?: null | ConstraintOptions<Type>);

        /**
         * @inheritdoc
         */
        public readonly defaultOption: string;

        /**
         * @inheritdoc
         */
        public readonly requiredOptions: string[];
    }
}
