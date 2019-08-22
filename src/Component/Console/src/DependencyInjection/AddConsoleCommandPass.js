const Command = Jymfony.Component.Console.Command.Command;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.Console.DependencyInjection
 */
export default class AddConsoleCommandPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition(Jymfony.Bundle.FrameworkBundle.Console.Application)) {
            return;
        }

        const commandServices = container.findTaggedServiceIds('console.command');
        const application = container.getDefinition(Jymfony.Bundle.FrameworkBundle.Console.Application);

        for (const id of Object.keys(commandServices)) {
            const definition = container.getDefinition(id);
            const className = container.parameterBag.resolveValue(definition.getClass());

            let r;
            try {
                r = new ReflectionClass(className);
            } catch (e) {
                if (e instanceof ReflectionException) {
                    const message = __jymfony.sprintf('Class "%s" used for service "%s" cannot be found.', className, id);
                    e = new InvalidArgumentException(message, null, e);
                }

                throw e;
            }

            if (! r.isSubclassOf(Command)) {
                throw new InvalidArgumentException(
                    __jymfony.sprintf('The service "%s" tagged "console.command" must be a subclass of "%s".', id, Command))
                ;
            }

            application.addMethodCall('add', [ new Reference(id) ]);
        }
    }
}
