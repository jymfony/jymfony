declare namespace Jymfony.Component.Validator.Constraints {
    import Composite = Jymfony.Component.Validator.Constraints.Composite;

    export class Collection extends Composite {
        public static readonly MISSING_FIELD_ERROR: string;
        public static readonly NO_SUCH_FIELD_ERROR: string;

        public fields: string[];
        public allowExtraFields: boolean;
        public allowMissingFields: boolean;
        public extraFieldsMessage: string;
        public missingFieldsMessage: string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: ConstraintOptions<Collection>): this;
        constructor(options?: ConstraintOptions<Collection>);

        getRequiredOptions(): string[];

        /**
         * @inheritdoc
         */
        protected _initializeNestedConstraints(): void;
        protected _getCompositeOption(): string;
    }
}
