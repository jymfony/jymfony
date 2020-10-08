declare namespace Jymfony.Component.Validator.Constraints {
    import CardScheme = Jymfony.Component.Validator.Constraints.CardScheme;
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;

    /**
     * Validates that a card number belongs to a specified scheme.
     */
    export class CardSchemeValidator extends ConstraintValidator {
        protected _schemes: Record<string, RegExp>;

        __construct(): this;
        constructor();

        /**
         * Validates a creditcard belongs to a specified scheme.
         */
        validate(value: any, constraint: CardScheme): void;
    }
}
