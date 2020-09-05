const MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;

/**
 * Validates values against constraints.
 *
 * @memberOf Jymfony.Component.Validator.Validator
 */
class ValidatorInterface extends MetadataFactoryInterface.definition {
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
     * @returns {Promise<Jymfony.Component.Validator.ConstraintViolationListInterface>} A list of constraint violations.
     *                                                                                  If the list is empty, validation succeeded.
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
     * @returns {Promise<Jymfony.Component.Validator.ConstraintViolationListInterface>} A list of constraint violations.
     *                                                                                  If the list is empty, validation succeeded.
     */
    async validateProperty(object, propertyName, groups = null) { }

    /**
     * Validates a value against the constraints specified for an object's
     * property.
     *
     * @param {Object|string} objectOrClass The object or its class name
     * @param {string} propertyName The name of the property
     * @param {*} value The value to validate against the property's constraints
     * @param {string|Jymfony.Component.Validator.Constraints.GroupSequence|(string|Jymfony.Component.Validator.Constraints.GroupSequence)[]|null} [groups] The validation groups to validate. If none is given, "Default" is assumed
     *
     * @returns {Promise<Jymfony.Component.Validator.ConstraintViolationListInterface>} A list of constraint violations.
     *                                                                                  If the list is empty, validation succeeded.
     */
    async validatePropertyValue(objectOrClass, propertyName, value, groups = null) { }

    /**
     * Starts a new validation context and returns a validator for that context.
     *
     * The returned validator collects all violations generated within its
     * context. You can access these violations with the
     * {@link ContextualValidatorInterface.violations} method.
     *
     * @returns {Jymfony.Component.Validator.Validator.ContextualValidatorInterface} The validator for the new context
     */
    startContext() { }

    /**
     * Returns a validator in the given execution context.
     *
     * The returned validator adds all generated violations to the given
     * context.
     *
     * @returns {Jymfony.Component.Validator.Validator.ContextualValidatorInterface} The validator for that context
     */
    inContext(context) { }

    /**
     * Returns the locale used in this validator session.
     *
     * @returns {string}
     */
    get locale() { }
}

export default getInterface(ValidatorInterface);
