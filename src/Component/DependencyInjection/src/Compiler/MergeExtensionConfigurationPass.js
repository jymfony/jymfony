const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const PrependExtensionInterface = Jymfony.Component.DependencyInjection.Extension.PrependExtensionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class MergeExtensionConfigurationPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        const parameters = container.parameterBag.all();

        for (const extension of Object.values(container.getExtensions())) {
            if (extension instanceof PrependExtensionInterface) {
                extension.prepend(container);
            }
        }

        for (const [ name, extension ] of __jymfony.getEntries(container.getExtensions())) {
            let configs = container.getExtensionConfig(name);
            if (! configs) {
                continue;
            }

            configs = container.parameterBag.resolveValue(configs);

            const tmpContainer = new ContainerBuilder(container.parameterBag);
            tmpContainer.setResourceTracking(container.isTrackingResources());
            tmpContainer.addObjectResource(extension);

            extension.load(configs, tmpContainer);

            container.merge(tmpContainer);
            container.parameterBag.add(parameters);
        }
    }
}

module.exports = MergeExtensionConfigurationPass;
