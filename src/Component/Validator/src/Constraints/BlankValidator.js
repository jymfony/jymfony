const Blank = Jymfony.Component.Validator.Constraints.Blank;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class BlankValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Blank)) {
            throw new UnexpectedTypeException(constraint, Blank);
        }

        if ('' !== value && null !== value && undefined !== value) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Blank.NOT_BLANK_ERROR)
                .addViolation();
        }
    }
}
