const Constraint = Jymfony.Component.Validator.Constraint;
const ValidationFailedException = Jymfony.Component.Validator.Exception.ValidationFailedException;
const ValidatorBuilder = Jymfony.Component.Validator.ValidatorBuilder;
const ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;

/**
 * Entry point for the Validator component.
 *
 * @memberOf Jymfony.Component.Validator
 * @final
 */
export default class Validation {
    /**
     * Creates a callable chain of constraints.
     *
     * @param {Jymfony.Component.Validator.Constraint|Jymfony.Component.Validator.ValidatorInterface|null} constraintOrValidator
     * @param {Jymfony.Component.Validator.Constraint[]} constraints
     *
     * @returns {Function|function(*):Promise<*>}
     */
    static createCallable(constraintOrValidator = null, ...constraints) {
        let validator = constraintOrValidator;

        if (constraintOrValidator instanceof Constraint) {
            constraints = [ constraintOrValidator, ...constraints ];
            validator = null;
        } else if (null !== constraintOrValidator && !(constraintOrValidator instanceof ValidatorInterface)) {
            throw new TypeError(__jymfony.sprintf('Argument 1 passed to "Jymfony.Component.Validator.createCallable()" must be a "%s" or a "%s" object, "%s" given.', ReflectionClass.getClassName(Constraint), ReflectionClass.getClassName(ValidatorInterface), __jymfony.get_debug_type(constraintOrValidator)));
        }

        validator = validator || __self.createValidator();

        return async function (value, groups = null) {
            const violations = await validator.validate(value, constraints, groups);
            if (0 !== violations.length) {
                throw new ValidationFailedException(value, violations);
            }

            return value;
        };
    }

    /**
     * Creates a new validator.
     * If you want to configure the validator, use {@link createValidatorBuilder()} instead.
     *
     * @returns {Jymfony.Component.Validator.Validation.ValidatorInterface}
     */
    static createValidator() {
        return __self.createValidatorBuilder().getValidator();
    }

    /**
     * Creates a configurable builder for validator objects.
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    static createValidatorBuilder() {
        return new ValidatorBuilder();
    }

    /**
     * This class cannot be instantiated.
     *
     * @private
     */
    constructor() {
        throw new Error('This class cannot be constructed');
    }
}
