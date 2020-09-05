declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class CardScheme extends Constraint {
        public static readonly NOT_NUMERIC_ERROR: string;
        public static readonly INVALID_FORMAT_ERROR: string;

        message: string;
        schemes: undefined | string[];

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<CardScheme>): this;
        constructor(options?: null | ConstraintOptions<CardScheme>);

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
