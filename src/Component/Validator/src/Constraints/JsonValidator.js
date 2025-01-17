const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Json = Jymfony.Component.Validator.Constraints.Json;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class JsonValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Json)) {
            throw new UnexpectedTypeException(constraint, Json);
        }

        if (null === value || undefined === value) {
            return;
        }

        value = String(value);

        try {
            JSON.parse(value);
        } catch {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Json.INVALID_JSON_ERROR)
                .addViolation();
        }
    }
}
