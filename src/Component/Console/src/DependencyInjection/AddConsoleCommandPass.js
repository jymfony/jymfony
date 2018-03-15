const Command = Jymfony.Component.Console.Command.Command;
const Alias = Jymfony.Component.DependencyInjection.Alias;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.Component.Console.DependencyInjection
 */
class AddConsoleCommandPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritDoc
     */
    process(container) {
        const commandServices = container.findTaggedServiceIds('console.command');
        const serviceIds = { };

        for (let id of Object.keys(commandServices)) {
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

            let commandId = `console.command.${className.replace('.', '_').toLowerCase()}`;
            if (container.hasAlias(commandId) || serviceIds[commandId]) {
                commandId += `_${id}`;
            }

            if (! definition.isPublic()) {
                container.setAlias(commandId, new Alias(id).setPublic(true));
                id = commandId;
            }

            serviceIds[commandId] = id;
        }

        container.setParameter('console.command.ids', Object.values(serviceIds));
    }
}

module.exports = AddConsoleCommandPass;
