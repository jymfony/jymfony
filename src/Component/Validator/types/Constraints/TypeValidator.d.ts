declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Type = Jymfony.Component.Validator.Constraints.Type;

    export class TypeValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Type): Promise<void>;
    }
}
