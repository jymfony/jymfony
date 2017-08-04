const CompilerPassInterface = Jymfony.Component.DependencyInjection.CompilerPassInterface;
const PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.PriorityTaggedServiceTrait;

/**
 * @memberOf Jymfony.FrameworkBundle.DependencyInjection
 */
class AddCacheWarmerPass extends mix(CompilerPassInterface, PriorityTaggedServiceTrait) {
    /**
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    process(container) {
        if (! container.hasDefinition('cache_warmer')) {
            return;
        }

        let warmers = this.findAndSortTaggedServices('kernel.cache_warmer', container);

        let arrayWarmers = Array.from(warmers);
        if (arrayWarmers.isEmpty()) {
            return;
        }

        container.getDefinition('cache_warmer').replaceArgument(0, arrayWarmers);
    }
}

module.exports = AddCacheWarmerPass;
