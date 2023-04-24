declare namespace Jymfony.Component.Routing.DependencyInjection {
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;

    export class RoutingResolverPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
        private _resolverServiceId: string;
        private _loaderTag: string;

        /**
         * Constructor.
         *
         * @param [resolverServiceId = 'routing.resolver']
         * @param [loaderTag = 'routing.loader']
         */
        __construct(resolverServiceId?: string, loaderTag?: string): void;
        constructor(resolverServiceId?: string, loaderTag?: string);

        /**
         * @inheritdoc
         */
        process(container: ContainerInterface): void;
    }
}
