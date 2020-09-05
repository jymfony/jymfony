const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const NotNull = Jymfony.Component.Validator.Constraints.NotNull;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NotNullValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof NotNull)) {
            throw new UnexpectedTypeException(constraint, NotNull);
        }

        if (null === value || undefined === value) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(NotNull.IS_NULL_ERROR)
                .addViolation();
        }
    }
}
