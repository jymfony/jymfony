const ConstraintValidatorFactoryInterface = Jymfony.Component.Validator.ConstraintValidatorFactoryInterface;
const ConstraintValidatorInterface = Jymfony.Component.Validator.ConstraintValidatorInterface;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

/**
 * Uses a service container to create constraint validators.
 *
 * @memberOf Jymfony.Component.Validator
 */
export default class ContainerConstraintValidatorFactory extends implementationOf(ConstraintValidatorFactoryInterface) {
    /**
     * @type {Jymfony.Contracts.DependencyInjection.ContainerInterface}
     *
     * @private
     */
    _container;

    /**
     * @type {Object.<string, Jymfony.Component.Validator.ConstraintValidator>}
     *
     * @private
     */
    _validators = {};

    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.DependencyInjection.ContainerInterface} container
     */
    __construct(container) {
        this._container = container;
    }

    /**
     * @inheritdoc
     *
     * @throws ValidatorException      When the validator class does not exist
     * @throws UnexpectedTypeException When the validator is not an instance of ConstraintValidatorInterface
     */
    getInstance(constraint) {
        const validatedBy = constraint.validatedBy;
        const name = isFunction(validatedBy) ? ReflectionClass.getClassName(validatedBy) : validatedBy;

        if (undefined === this._validators[name]) {
            if (this._container.has(name)) {
                this._validators[name] = this._container.get(name);
            } else {
                if (! ReflectionClass.exists(name)) {
                    throw new ValidatorException(__jymfony.sprintf('Constraint validator "%s" does not exist or is not enabled. Check the "validatedBy" method in your constraint class "%s".', name, __jymfony.get_debug_type(constraint)));
                }

                const class_ = ReflectionClass.getClass(name);
                this._validators[name] = new class_();
            }
        }

        if (! (this._validators[name] instanceof ConstraintValidatorInterface)) {
            throw new UnexpectedTypeException(this._validators[name], ConstraintValidatorInterface);
        }

        return this._validators[name];
    }
}
