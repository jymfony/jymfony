const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const Valid = Jymfony.Component.Validator.Constraints.Valid;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class ValidValidator extends ConstraintValidator {
    validate(value, constraint) {
        if (! (constraint instanceof Valid)) {
            throw new UnexpectedTypeException(constraint, Valid);
        }

        if (undefined === value || null === value) {
            return;
        }

        return this._context
            .validator
            .inContext(this._context)
            .validate(value, null, this._context.group);
    }
}
