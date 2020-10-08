declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import IsNull = Jymfony.Component.Validator.Constraints.IsNull;

    export class IsNullValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: IsNull): void;
    }
}
