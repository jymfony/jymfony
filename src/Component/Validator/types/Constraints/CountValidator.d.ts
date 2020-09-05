declare namespace Jymfony.Component.Validator.Constraints {
    import Count = Jymfony.Component.Validator.Constraints.Count;
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;

    export class CountValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Count): Promise<void>;
    }
}
