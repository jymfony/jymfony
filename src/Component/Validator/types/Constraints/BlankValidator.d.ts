declare namespace Jymfony.Component.Validator.Constraints {
    import Blank = Jymfony.Component.Validator.Constraints.Blank;
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;

    export class BlankValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Blank): void;
    }
}
