declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

    export class NotIdenticalTo extends AbstractComparison {
        public static readonly IS_IDENTICAL_ERROR: string;

        public message: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<NotIdenticalTo>): this;
        constructor(options?: null | ConstraintOptions<NotIdenticalTo>);
    }
}
