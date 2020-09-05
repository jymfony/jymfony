declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import IsFalse = Jymfony.Component.Validator.Constraints.IsFalse;

    export class IsFalseValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: IsFalse): void;
    }
}
