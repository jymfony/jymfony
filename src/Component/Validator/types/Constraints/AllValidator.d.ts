declare namespace Jymfony.Component.Validator.Constraints {
    import All = Jymfony.Component.Validator.Constraints.All;
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;

    export class AllValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: All): Promise<void>;
    }
}
