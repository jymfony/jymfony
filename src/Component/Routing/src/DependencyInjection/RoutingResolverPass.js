const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;

/**
 * @memberOf Jymfony.Component.Routing.DependencyInjection
 */
class RoutingResolverPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
    __construct(resolverServiceId = 'routing.resolver', loaderTag = 'routing.loader') {
        this._resolverServiceId = resolverServiceId;
        this._loaderTag = loaderTag;
    }

    /**
     * @inheritDoc
     */
    process(container) {
        if (false === container.hasDefinition(this._resolverServiceId)) {
            return;
        }

        const definition = container.getDefinition(this._resolverServiceId);
        for (const serviceRef of this.findAndSortTaggedServices(this._loaderTag, container)) {
            definition.addMethodCall('addLoader', [ serviceRef ]);
        }
    }
}

module.exports = RoutingResolverPass;
