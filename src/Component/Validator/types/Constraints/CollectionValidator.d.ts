declare namespace Jymfony.Component.Validator.Constraints {
    import Collection = Jymfony.Component.Validator.Constraints.Collection;
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;

    export class CollectionValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Collection): Promise<void>;
    }
}
