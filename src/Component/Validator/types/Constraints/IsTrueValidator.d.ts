declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import IsTrue = Jymfony.Component.Validator.Constraints.IsTrue;

    export class IsTrueValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: IsTrue): void;
    }
}
