declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Luhn = Jymfony.Component.Validator.Constraints.Luhn;

    export class LuhnValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Luhn): void;
    }
}
