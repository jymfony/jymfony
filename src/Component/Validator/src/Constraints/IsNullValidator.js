const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const IsNull = Jymfony.Component.Validator.Constraints.IsNull;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsNullValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof IsNull)) {
            throw new UnexpectedTypeException(constraint, IsNull);
        }

        if (null !== value && undefined !== value) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(IsNull.NOT_NULL_ERROR)
                .addViolation();
        }
    }
}
