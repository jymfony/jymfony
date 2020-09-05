const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const IsFalse = Jymfony.Component.Validator.Constraints.IsFalse;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsFalseValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof IsFalse)) {
            throw new UnexpectedTypeException(constraint, IsFalse);
        }

        if (null === value || undefined === value || false === value || 0 === value || '0' === value) {
            return;
        }

        this._context.buildViolation(constraint.message)
            .setParameter('{{ value }}', this._formatValue(value))
            .setCode(IsFalse.NOT_FALSE_ERROR)
            .addViolation();
    }
}
