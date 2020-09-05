declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Valid = Jymfony.Component.Validator.Constraints.Valid;

    export class ValidValidator extends ConstraintValidator {
        validate(value: any, constraint: Valid): Promise<void>;
    }
}
