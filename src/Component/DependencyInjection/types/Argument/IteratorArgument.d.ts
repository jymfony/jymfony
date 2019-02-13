declare namespace Jymfony.Component.DependencyInjection.Argument {
    import Reference = Jymfony.Component.DependencyInjection.Reference;

    /**
     * Represents a collection of values to lazily iterate over.
     */
    export class IteratorArgument extends implementationOf(ArgumentInterface, ReferenceSetArgumentTrait) {
        /**
         * Constructor.
         */
        __construct(values: Reference[]): void;
        constructor(values: Reference[]);
    }
}
