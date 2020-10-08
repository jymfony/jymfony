declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

    export class IdenticalTo extends AbstractComparison {
        public static readonly NOT_IDENTICAL_ERROR: string;
        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<IdenticalTo>): this;
        constructor(options?: null | ConstraintOptions<IdenticalTo>);
    }
}
