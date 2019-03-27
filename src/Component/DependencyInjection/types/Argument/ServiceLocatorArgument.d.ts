declare namespace Jymfony.Component.DependencyInjection.Argument {
    import Reference = Jymfony.Component.DependencyInjection.Reference;

    /**
     * Represents a closure acting as a service locator.
     */
    export class ServiceLocatorArgument extends implementationOf(ArgumentInterface, ReferenceSetArgumentTrait) {
        /**
         * Constructor.
         */
        __construct(values: Reference[]): void;
        constructor(values: Reference[]);
    }
}
