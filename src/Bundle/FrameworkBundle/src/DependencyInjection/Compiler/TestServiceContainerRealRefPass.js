const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.FrameworkBundle.DependencyInjection.Compiler
 */
export default class TestServiceContainerRealRefPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition('test.service_container')) {
            return;
        }

        const testContainer = container.getDefinition('test.service_container');
        let privateContainer = testContainer.getArgument(2);
        if (privateContainer instanceof Reference) {
            privateContainer = container.getDefinition(privateContainer.toString());
        }

        const definitions = container.getDefinitions();
        const privateServices = privateContainer.getArgument(0);

        for (const [ id, argument ] of __jymfony.getEntries(privateServices)) {
            const target = argument.values[0].toString();
            if (undefined !== definitions[target]) {
                argument.values = [ new Reference(target) ];
            } else {
                delete privateServices[id];
            }
        }

        privateContainer.replaceArgument(0, privateServices);
    }
}
