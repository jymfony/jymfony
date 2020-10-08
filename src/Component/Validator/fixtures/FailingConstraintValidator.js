const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;

export default class FailingConstraintValidator extends ConstraintValidator {
    validate(value, constraint) {
        this._context.addViolation(constraint.message, {});
    }
}
