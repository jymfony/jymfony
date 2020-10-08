declare namespace Jymfony.Component.Validator.DependencyInjection {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

    export class AddConstraintValidatorsPass extends implementationOf(CompilerPassInterface) {
        private _validatorFactoryServiceId: string;
        private _constraintValidatorTag: string;

        /**
         * Constructor.
         */
        __construct(validatorFactoryServiceId?: string, constraintValidatorTag?: string): void;
        constructor(validatorFactoryServiceId?: string, constraintValidatorTag?: string);

        process(container: ContainerInterface): void;
    }
}
