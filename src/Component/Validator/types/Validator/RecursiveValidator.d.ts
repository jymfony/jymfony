declare namespace Jymfony.Component.Validator.Validator {
    import ClassMetadataInterface = Jymfony.Component.Validator.Mapping.ClassMetadataInterface;
    import ExecutionContextFactoryInterface = Jymfony.Component.Validator.Context.ExecutionContextFactoryInterface;
    import ExecutionContextInterface = Jymfony.Component.Validator.Context.ExecutionContextInterface;
    import MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;
    import RecursiveContextualValidator = Jymfony.Component.Validator.Validator.RecursiveContextualValidator;
    import ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;

    /**
     * Recursive implementation of {@link ValidatorInterface}.
     */
    export class RecursiveValidator extends implementationOf(ValidatorInterface) {
        public static readonly defaultLocale: string;

        protected _contextFactory: ExecutionContextFactoryInterface;
        protected _metadataFactory: MetadataFactoryInterface;
        protected _validatorFactory: ConstraintValidatorFactoryInterface;
        private _locale: string;

        /**
         * Creates a new validator.
         */
        __construct(contextFactory: ExecutionContextFactoryInterface, metadataFactory: MetadataFactoryInterface, validatorFactory: ConstraintValidatorFactoryInterface): void;
        constructor(contextFactory: ExecutionContextFactoryInterface, metadataFactory: MetadataFactoryInterface, validatorFactory: ConstraintValidatorFactoryInterface);

        /**
         * @inheritdoc
         */
        startContext(root?: any): RecursiveContextualValidator;

        /**
         * @inheritdoc
         */
        inContext(context: ExecutionContextInterface): RecursiveContextualValidator;

        /**
         * @inheritdoc
         */
        getMetadataFor(object: string | object): ClassMetadataInterface;

        /**
         * @inheritdoc
         */
        hasMetadataFor(object: string | object): boolean;

        /**
         * @inheritdoc
         */
        public locale: string;

        /**
         * @inheritdoc
         */
        validate(value: any, constraints?: Constraint | Constraint[], groups?: GroupsType): Promise<ConstraintViolationListInterface>;

        /**
         * @inheritdoc
         */
        validateProperty(object: object, propertyName: string, groups?: GroupsType): Promise<ConstraintViolationListInterface>;

        /**
         * @inheritdoc
         */
        validatePropertyValue(objectOrClass: string | object, propertyName: string, value: any, groups?: GroupsType): Promise<ContextualValidatorInterface>;
    }
}
