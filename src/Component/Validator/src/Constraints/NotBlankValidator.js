const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const NotBlank = Jymfony.Component.Validator.Constraints.NotBlank;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

const empty = value => ! value || ((isObjectLiteral(value) || isArray(value)) && 0 === Object.keys(value).length);

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NotBlankValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof NotBlank)) {
            throw new UnexpectedTypeException(constraint, NotBlank);
        }

        if (constraint.allowNull && (null === value || undefined === value)) {
            return;
        }

        if (isString(value) && !! constraint.normalizer) {
            value = (constraint.normalizer)(value);
        }

        if (false === value || (empty(value) && '0' != value)) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(NotBlank.IS_BLANK_ERROR)
                .addViolation();
        }
    }
}
