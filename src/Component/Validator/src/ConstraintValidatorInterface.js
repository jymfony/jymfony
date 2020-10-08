/**
 * @memberOf Jymfony.Component.Validator
 */
class ConstraintValidatorInterface {
    /**
     * Initializes the constraint validator.
     *
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context The current validation context
     */
    initialize(context) { }

    /**
     * Checks if the passed value is valid.
     *
     * @param {*} value The value that should be validated
     * @param {Jymfony.Component.Validator.Constraint} constraint The constraint for the validation
     */
    validate(value, constraint) { }
}

export default getInterface(ConstraintValidatorInterface);
