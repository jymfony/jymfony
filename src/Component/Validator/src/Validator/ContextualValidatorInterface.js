/**
 * A validator in a specific execution context.
 *
 * @memberOf Jymfony.Component.Validator.Validator
 */
class ContextualValidatorInterface {
    /**
     * Appends the given path to the property path of the context.
     *
     * If called multiple times, the path will always be reset to the context's
     * original path with the given path appended to it.
     *
     * @param {string} path The path to append
     *
     * @returns {Jymfony.Component.Validator.Validator.ContextualValidatorInterface}
     */
    atPath(path) { }

    /**
     * Validates a value against a constraint or a list of constraints.
     *
     * If no constraint is passed, the constraint
     * {@link Jymfony.Component.Validator.Constraints.Valid} is assumed.
     *
     * @param {*} value The value to validate
     * @param {Jymfony.Component.Validator.Constraint|Jymfony.Component.Validator.Constraint[]} [constraints] The constraint(s) to validate against
     * @param {string|Jymfony.Component.Validator.Constraints.GroupSequence|(string|Jymfony.Component.Validator.Constraints.GroupSequence)[]|null} [groups] The validation groups to validate. If none is given, "Default" is assumed
     *
     * @returns {Promise<Jymfony.Component.Validator.Validator.ContextualValidatorInterface>}
     */
    async validate(value, constraints = null, groups = null) { }

    /**
     * Validates a property of an object against the constraints specified
     * for this property.
     *
     * @param {Object} object The object
     * @param {string} propertyName The name of the validated property
     * @param {string|Jymfony.Component.Validator.Constraints.GroupSequence|(string|Jymfony.Component.Validator.Constraints.GroupSequence)[]|null} [groups] The validation groups to validate. If none is given, "Default" is assumed
     *
     * @returns {Promise<Jymfony.Component.Validator.Validator.ContextualValidatorInterface>}
     */
    async validateProperty(object, propertyName, groups = null) { }

    /**
     * Validates a value against the constraints specified for an object's
     * property.
     *
     * @param {object|string} objectOrClass The object or its class name
     * @param {string} propertyName The name of the property
     * @param {*} value The value to validate against the property's constraints
     * @param {string|Jymfony.Component.Validator.Constraints.GroupSequence|(string|Jymfony.Component.Validator.Constraints.GroupSequence)[]|null} [groups] The validation groups to validate. If none is given, "Default" is assumed
     *
     * @returns {Promise<Jymfony.Component.Validator.Validator.ContextualValidatorInterface>}
     */
    async validatePropertyValue(objectOrClass, propertyName, value, groups = null) { }

    /**
     * Returns the violations that have been generated so far in the context
     * of the validator.
     *
     * @returns {Jymfony.Component.Validator.Validator.ConstraintViolationListInterface} The constraint violations
     */
    get violations() { }
}

export default getInterface(ContextualValidatorInterface);
