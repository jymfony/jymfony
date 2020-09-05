/**
 * Specifies an object able to return the correct ConstraintValidatorInterface
 * instance given a Constraint object.
 *
 * @memberOf Jymfony.Component.Validator
 */
class ConstraintValidatorFactoryInterface {
    /**
     * Given a Constraint, this returns the ConstraintValidatorInterface
     * object that should be used to verify its validity.
     *
     * @param {Jymfony.Component.Validator.Constraint} constraint
     *
     * @returns {Jymfony.Component.Validator.ConstraintValidatorInterface}
     */
    getInstance(constraint) { }
}

export default getInterface(ConstraintValidatorFactoryInterface);
