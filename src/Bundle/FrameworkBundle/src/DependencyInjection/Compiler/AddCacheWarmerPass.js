const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;

/**
 * @memberOf Jymfony.FrameworkBundle.DependencyInjection.Compiler
 */
class AddCacheWarmerPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition('cache_warmer')) {
            return;
        }

        const warmers = Array.from(this.findAndSortTaggedServices('kernel.cache_warmer', container));
        if (0 === warmers.length) {
            return;
        }

        container.getDefinition('cache_warmer').replaceArgument(0, warmers);
    }
}

module.exports = AddCacheWarmerPass;
