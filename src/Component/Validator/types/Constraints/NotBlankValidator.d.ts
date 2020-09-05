declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import NotBlank = Jymfony.Component.Validator.Constraints.NotBlank;

    export class NotBlankValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: NotBlank): void;
    }
}
