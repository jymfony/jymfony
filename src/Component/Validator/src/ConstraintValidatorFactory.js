const ConstraintValidatorFactoryInterface = Jymfony.Component.Validator.ConstraintValidatorFactoryInterface;
const ConstraintValidatorInterface = Jymfony.Component.Validator.ConstraintValidatorInterface;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * Default implementation of the ConstraintValidatorFactoryInterface.
 *
 * This enforces the convention that the validatedBy() method on any
 * Constraint will return the class name of the ConstraintValidator that
 * should validate the Constraint.
 *
 * @memberOf Jymfony.Component.Validator
 */
export default class ConstraintValidatorFactory extends implementationOf(ConstraintValidatorFactoryInterface) {
    /**
     * @type {Object.<string, Jymfony.Component.Validator.ConstraintValidatorInterface>}
     *
     * @private
     */
    _validators = {};

    /**
     * @inheritdoc
     */
    getInstance(constraint) {
        const reflectionClass = new ReflectionClass(constraint.validatedBy);
        const className = reflectionClass.name;

        if (! reflectionClass.isSubclassOf(ConstraintValidatorInterface)) {
            throw new UnexpectedTypeException(className, ConstraintValidatorInterface);
        }

        if (undefined === className) {
            return reflectionClass.newInstance();
        }

        if (undefined === this._validators[className]) {
            this._validators[className] = reflectionClass.newInstance();
        }

        return this._validators[className];
    }
}
