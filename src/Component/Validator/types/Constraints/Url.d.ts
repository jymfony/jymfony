declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Url extends Constraint {
        public static readonly INVALID_URL_ERROR: string;

        public message: string;
        public protocols: string[];
        public relativeProtocol: boolean;
        public normalizer?: (value: string) => string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Url>): this;
        constructor(options?: null | ConstraintOptions<Url>);
    }
}
