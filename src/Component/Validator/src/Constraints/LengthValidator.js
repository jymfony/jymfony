const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Length = Jymfony.Component.Validator.Constraints.Length;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class LengthValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Length)) {
            throw new UnexpectedTypeException(constraint, Length);
        }

        if (null === value || undefined === value) {
            return;
        }

        let stringValue = String(value);
        if (!! constraint.normalizer) {
            stringValue = (constraint.normalizer)(stringValue);
        }

        if (undefined !== constraint.max && stringValue.length > constraint.max) {
            this._context.buildViolation(constraint.min == constraint.max ? constraint.exactMessage : constraint.maxMessage)
                .setParameter('{{ value }}', this._formatValue(stringValue))
                .setParameter('{{ limit }}', constraint.max)
                .setInvalidValue(value)
                .setPlural(~~constraint.max)
                .setCode(Length.TOO_LONG_ERROR)
                .addViolation();

            return;
        }

        if (undefined !== constraint.min && stringValue.length < constraint.min) {
            this._context.buildViolation(constraint.min == constraint.max ? constraint.exactMessage : constraint.minMessage)
                .setParameter('{{ value }}', this._formatValue(stringValue))
                .setParameter('{{ limit }}', constraint.min)
                .setInvalidValue(value)
                .setPlural(~~constraint.min)
                .setCode(Length.TOO_SHORT_ERROR)
                .addViolation();
        }
    }
}
