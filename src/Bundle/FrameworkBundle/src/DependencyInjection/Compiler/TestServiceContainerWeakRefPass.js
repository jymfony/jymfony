const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Container = Jymfony.Component.DependencyInjection.Container;
const ServiceClosureArgument = Jymfony.Component.DependencyInjection.Argument.ServiceClosureArgument;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.FrameworkBundle.DependencyInjection.Compiler
 */
export default class TestServiceContainerWeakRefPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition('test.service_container')) {
            return;
        }

        const privateServices = {};
        const definitions = container.getDefinitions();

        for (const [ id, definition ] of __jymfony.getEntries(definitions)) {
            if (id && '.' !== id.charAt(0) && ! definition.isPublic() && ! definition.isAbstract()) {
                privateServices[id] = new ServiceClosureArgument(new Reference(id, Container.IGNORE_ON_UNINITIALIZED_REFERENCE));
            }
        }

        const aliases = container.getAliases();

        for (let [ id, alias ] of __jymfony.getEntries(aliases)) {
            if (id && '.' !== id.charAt(0) && ! alias.isPublic()) {
                let target = alias.toString();
                while (aliases[target] !== undefined) {
                    alias = aliases[target];
                    target = alias.toString();
                }

                if (undefined !== definitions[target] && ! definitions[target].isAbstract()) {
                    privateServices[id] = new ServiceClosureArgument(new Reference(target, Container.IGNORE_ON_UNINITIALIZED_REFERENCE));
                }
            }
        }

        if (0 < Object.values(privateServices).length) {
            definitions['test.service_container'].getArgument(2).replaceArgument(0, privateServices);
        }
    }
}
