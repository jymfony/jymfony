const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;

/**
 * @memberOf Jymfony.FrameworkBundle.DependencyInjection.Compiler
 */
class AddCacheWarmerPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
    /**
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    process(container) {
        if (! container.hasDefinition('cache_warmer')) {
            return;
        }

        const warmers = this.findAndSortTaggedServices('kernel.cache_warmer', container);

        const arrayWarmers = Array.from(warmers);
        if (0 === arrayWarmers.length) {
            return;
        }

        container.getDefinition('cache_warmer').replaceArgument(0, arrayWarmers);
    }
}

module.exports = AddCacheWarmerPass;
