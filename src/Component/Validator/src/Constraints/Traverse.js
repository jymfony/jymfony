const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Traverse extends Constraint {
    __construct(options = null) {
        this.traverse = true;

        if (isObjectLiteral(options) && undefined !== options.groups) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The option "groups" is not supported by the constraint "%s".', ReflectionClass.getClassName(this)));
        }

        return super.__construct(options);
    }

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'traverse';
    }

    /**
     * @inheritdoc
     */
    get targets() {
        return __self.CLASS_CONSTRAINT;
    }
}
