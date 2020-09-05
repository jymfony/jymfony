const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const IsTrue = Jymfony.Component.Validator.Constraints.IsTrue;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsTrueValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof IsTrue)) {
            throw new UnexpectedTypeException(constraint, IsTrue);
        }

        if (true === value || 1 === value || '1' === value) {
            return;
        }

        this._context.buildViolation(constraint.message)
            .setParameter('{{ value }}', this._formatValue(value))
            .setCode(IsTrue.NOT_TRUE_ERROR)
            .addViolation();
    }
}
