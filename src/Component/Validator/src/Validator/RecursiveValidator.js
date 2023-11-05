const RecursiveContextualValidator = Jymfony.Component.Validator.Validator.RecursiveContextualValidator;
const ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;

/**
 * Recursive implementation of {@link ValidatorInterface}.
 *
 * @memberOf Jymfony.Component.Validator.Validator
 */
export default class RecursiveValidator extends implementationOf(ValidatorInterface) {
    /**
     * @type {Jymfony.Component.Validator.Context.ExecutionContextFactoryInterface}
     *
     * @protected
     */
    _contextFactory;

    /**
     * @type {Jymfony.Contracts.Metadata.MetadataFactoryInterface}
     *
     * @protected
     */
    _metadataFactory;

    /**
     * @type {Jymfony.Component.Validator.ConstraintValidatorFactoryInterface}
     *
     * @protected
     */
    _validatorFactory;

    /**
     * @type {string}
     *
     * @private
     */
    _locale;

    /**
     * Creates a new validator.
     *
     * @param {Jymfony.Component.Validator.Context.ExecutionContextFactoryInterface} contextFactory
     * @param {Jymfony.Contracts.Metadata.MetadataFactoryInterface} metadataFactory
     * @param {Jymfony.Component.Validator.ConstraintValidatorFactoryInterface} validatorFactory
     */
    __construct(contextFactory, metadataFactory, validatorFactory) {
        this._contextFactory = contextFactory;
        this._metadataFactory = metadataFactory;
        this._validatorFactory = validatorFactory;
    }

    /**
     * @inheritdoc
     */
    startContext(root = null) {
        return new RecursiveContextualValidator(
            this._contextFactory.createContext(this, root),
            this._metadataFactory,
            this._validatorFactory
        );
    }

    /**
     * @inheritdoc
     */
    inContext(context) {
        return new RecursiveContextualValidator(
            context,
            this._metadataFactory,
            this._validatorFactory
        );
    }

    /**
     * @inheritdoc
     */
    getMetadataFor(object) {
        return this._metadataFactory.getMetadataFor(object);
    }

    /**
     * @inheritdoc
     */
    hasMetadataFor(object) {
        return this._metadataFactory.hasMetadataFor(object);
    }

    /**
     * @inheritdoc
     */
    get locale() {
        return this._locale || __self.defaultLocale || 'en-US';
    }

    /**
     * Sets the locale for the current validator.
     *
     * @param {string} locale
     */
    set locale(locale) {
        this._locale = locale;
    }

    /**
     * @inheritdoc
     */
    async validate(value, constraints = null, groups = null) {
        return (await this.startContext(value)
            .validate(value, constraints, groups))
            .violations;
    }

    /**
     * @inheritdoc
     */
    async validateProperty(object, propertyName, groups = null) {
        return (await this.startContext(object)
            .validateProperty(object, propertyName, groups))
            .violations;
    }

    /**
     * @inheritdoc
     */
    async validatePropertyValue(objectOrClass, propertyName, value, groups = null) {
        // If a class name is passed, take value as root
        return (await this.startContext(isObject(objectOrClass) ? objectOrClass : value)
            .validatePropertyValue(objectOrClass, propertyName, value, groups))
            .violations;
    }
}

RecursiveValidator.defaultLocale = 'en-US';
