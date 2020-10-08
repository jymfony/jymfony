declare namespace Jymfony.Component.Validator {
    import ConstraintValidatorFactoryInterface = Jymfony.Component.Validator.ConstraintValidatorFactoryInterface;
    import ConstraintValidatorInterface = Jymfony.Component.Validator.ConstraintValidatorInterface;

    /**
     * Default implementation of the ConstraintValidatorFactoryInterface.
     *
     * This enforces the convention that the validatedBy() method on any
     * Constraint will return the class name of the ConstraintValidator that
     * should validate the Constraint.
     */
    export class ConstraintValidatorFactory extends implementationOf(ConstraintValidatorFactoryInterface) {
        private _validators: Record<string, ConstraintValidatorInterface>;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        getInstance(constraint: Constraint): ConstraintValidatorInterface;
    }
}
