const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 *
 * @abstract
 */
export default class AbstractComparison extends Constraint {
    value;
    propertyPath;

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        if (isObjectLiteral(options)) {
            if (undefined === options.value && undefined === options.propertyPath) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('The "%s" constraint requires either the "value" or "propertyPath" option to be set.', __jymfony.get_debug_type(this)));
            }

            if (undefined !== options.value && undefined !== options.propertyPath) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('The "%s" constraint requires only one of the "value" or "propertyPath" options to be set, not both.', __jymfony.get_debug_type(this)));
            }

            if (undefined !== options.propertyPath && ! ReflectionClass.exists('Jymfony.Component.PropertyAccess.PropertyAccessor')) {
                throw new LogicException(__jymfony.sprintf('The "%s" constraint requires the Jymfony PropertyAccess component to use the "propertyPath" option.', __jymfony.get_debug_type(this)));
            }
        }

        return super.__construct(options);
    }

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'value';
    }
}
