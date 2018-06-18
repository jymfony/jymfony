const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;

/**
 * @memberOf Jymfony.Component.Routing.DependencyInjection
 */
class RoutingResolverPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
    /**
     * Constructor.
     *
     * @param {string} [resolverServiceId = 'routing.resolver']
     * @param {string} [loaderTag = 'routing.loader']
     */
    __construct(resolverServiceId = 'routing.resolver', loaderTag = 'routing.loader') {
        /**
         * @type {string}
         *
         * @private
         */
        this._resolverServiceId = resolverServiceId;

        /**
         * @type {string}
         *
         * @private
         */
        this._loaderTag = loaderTag;
    }

    /**
     * @inheritdoc
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
