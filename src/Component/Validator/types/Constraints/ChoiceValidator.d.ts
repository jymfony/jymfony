declare namespace Jymfony.Component.Validator.Constraints {
    import Choice = Jymfony.Component.Validator.Constraints.Choice;
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;

    /**
     * Validates that a card number belongs to a specified scheme.
     */
    export class ChoiceValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Choice): void;
    }
}
