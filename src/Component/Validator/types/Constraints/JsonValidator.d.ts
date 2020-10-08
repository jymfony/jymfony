declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Json = Jymfony.Component.Validator.Constraints.Json;

    export class JsonValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Json): void;
    }
}
