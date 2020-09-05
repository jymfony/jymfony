declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Choice extends Constraint {
        public static readonly NO_SUCH_CHOICE_ERROR: string;
        public static readonly TOO_FEW_ERROR: string;
        public static readonly TOO_MANY_ERROR: string;

        private choices?: any[];
        private callback?: TCallback;
        private multiple?: boolean;
        private min?: number;
        private max?: number;
        private message?: string;
        private multipleMessage?: string;
        private minMessage?: string;
        private maxMessage?: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        __construct(options?: null | ConstraintOptions<Choice>): this;
        constructor(options?: null | ConstraintOptions<Choice>);

        /**
         * @inheritdoc
         */
        public readonly defaultOption: string;
    }
}
