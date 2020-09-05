declare namespace Jymfony.Component.Validator {
    import Constraint = Jymfony.Component.Validator.Constraint;
    import ExecutionContextInterface = Jymfony.Component.Validator.Context.ExecutionContextInterface;

    export class ConstraintValidatorInterface {
        /**
         * Initializes the constraint validator.
         *
         * @param context The current validation context
         */
        initialize(context: ExecutionContextInterface): void;

        /**
         * Checks if the passed value is valid.
         *
         * @param value The value that should be validated
         * @param constraint The constraint for the validation
         */
        validate(value: any, constraint: Constraint): void | Promise<void>;
    }
}
