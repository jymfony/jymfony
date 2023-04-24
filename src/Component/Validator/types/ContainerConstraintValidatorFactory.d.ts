declare namespace Jymfony.Component.Validator {
    import ConstraintValidatorFactoryInterface = Jymfony.Component.Validator.ConstraintValidatorFactoryInterface;
    import ConstraintValidatorInterface = Jymfony.Component.Validator.ConstraintValidatorInterface;
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;

    /**
     * Uses a service container to create constraint validators.
     */
    export class ContainerConstraintValidatorFactory extends implementationOf(ConstraintValidatorFactoryInterface) {
        private _container: ContainerInterface;
        private _validators: Record<string, ConstraintValidatorInterface>;

        /**
         * Constructor.
         */
        __construct(container: ContainerInterface): void;
        constructor(container: ContainerInterface);

        /**
         * @inheritdoc
         *
         * @throws {Jymfony.Component.Validator.Exception.ValidatorException} When the validator class does not exist
         * @throws {Jymfony.Component.Validator.Exception.UnexpectedTypeException} When the validator is not an instance of ConstraintValidatorInterface
         */
        getInstance(constraint: Constraint): ConstraintValidatorInterface;
    }
}
