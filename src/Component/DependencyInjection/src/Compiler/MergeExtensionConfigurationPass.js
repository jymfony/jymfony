const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const PrependExtensionInterface = Jymfony.Component.DependencyInjection.Extension.PrependExtensionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
module.exports = class MergeExtensionConfigurationPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritDoc
     */
    process(container) {
        for (let extension of Object.values(container.getExtensions())) {
            if (extension instanceof PrependExtensionInterface) {
                extension.prepend(container);
            }
        }

        for (let [ name, extension ] of __jymfony.getEntries(container.getExtensions())) {
            let configs = container.getExtensionConfig(name);
            if (! configs) {
                continue;
            }

            configs = container.parameterBag.resolveValue(configs);

            let tmpContainer = new ContainerBuilder(container.parameterBag);
            tmpContainer.setResourceTracking(container.isTrackingResources());
            tmpContainer.addObjectResource(extension);

            extension.load(configs, tmpContainer);

            container.merge(tmpContainer);
            container.parameterBag.add(parameters);
        }
    }
};
