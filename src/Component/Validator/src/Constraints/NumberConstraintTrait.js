const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
class NumberConstraintTrait {
    /**
     * @private
     */
    _configureNumberConstraintOptions(options) {
        if (null === options) {
            options = [];
        } else if (! isObjectLiteral(options)) {
            options = { [this.defaultOption]: options };
        }

        if (options.propertyPath) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The "propertyPath" option of the "%s" constraint cannot be set.', __jymfony.get_debug_type(this)));
        }

        if (options.value) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The "value" option of the "%s" constraint cannot be set.', __jymfony.get_debug_type(this)));
        }

        options.value = 0;

        return options;
    }
}

export default getTrait(NumberConstraintTrait);
