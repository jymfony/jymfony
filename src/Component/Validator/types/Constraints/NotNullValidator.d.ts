declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import NotNull = Jymfony.Component.Validator.Constraints.NotNull;

    export class NotNullValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: NotNull): void;
    }
}
