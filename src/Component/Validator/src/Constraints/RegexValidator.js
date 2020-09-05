const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Regex = Jymfony.Component.Validator.Constraints.Regex;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class RegexValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Regex)) {
            throw new UnexpectedTypeException(constraint, Regex);
        }

        if (null === value || undefined === value) {
            return;
        }

        value = String(value);

        if (!! constraint.normalizer) {
            value = (constraint.normalizer)(value);
        }

        const match = !! value.match(constraint.pattern);
        if (constraint.match ? !match : match) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Regex.REGEX_FAILED_ERROR)
                .addViolation();
        }
    }
}
