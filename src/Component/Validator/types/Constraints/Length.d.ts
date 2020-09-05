declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Length extends Constraint {
        public static readonly TOO_SHORT_ERROR: string;
        public static readonly TOO_LONG_ERROR: string;

        public maxMessage: string;
        public minMessage: string;
        public exactMessage: string;
        public max?: number;
        public min?: number;
        public normalizer?: (arg: string) => string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Length>): this;
        constructor(options?: null | ConstraintOptions<Length>);
    }
}
