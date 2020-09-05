declare namespace Jymfony.Component.Validator {
    import Constraint = Jymfony.Component.Validator.Constraint;
    import ValidatorBuilder = Jymfony.Component.Validator.ValidatorBuilder;
    import ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;
    import GroupsType = Jymfony.Component.Validator.Validator.GroupsType;

    /**
     * Entry point for the Validator component.
     *
     * @final
     */
    export class Validation {
        /**
         * Creates a callable chain of constraints.
         */
        static createCallable<T = any>(constraintOrValidator?: Constraint | ValidatorInterface | null, ...constraints: Constraint[]): (value: T, groups: GroupsType) => Promise<T>;

        /**
         * Creates a new validator.
         * If you want to configure the validator, use {@link createValidatorBuilder()} instead.
         */
        static createValidator(): ValidatorInterface;

        /**
         * Creates a configurable builder for validator objects.
         */
        static createValidatorBuilder(): ValidatorBuilder;

        /**
         * This class cannot be instantiated.
         */
        private constructor();
    }
}
