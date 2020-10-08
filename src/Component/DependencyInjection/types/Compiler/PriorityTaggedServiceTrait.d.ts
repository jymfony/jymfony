declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import Reference = Jymfony.Component.DependencyInjection.Reference;

    export class PriorityTaggedServiceTrait {
        public static readonly definition: Newable<PriorityTaggedServiceTrait>;

        /**
         * Finds all services with the given tag name and order them by their priority.
         */
        findAndSortTaggedServices(tagName: string, container: ContainerBuilder): IterableIterator<Reference>;
    }
}
