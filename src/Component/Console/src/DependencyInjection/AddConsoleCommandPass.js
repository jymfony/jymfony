const Command = Jymfony.Component.Console.Command;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.Component.Console.DependencyInjection
 */
class AddConsoleCommandPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritDoc
     */
    process(container) {
        let commandServices = container.findTaggedServiceIds('console.command');
        let serviceIds = { };

        for (let [ id, tags ] of __jymfony.getEntries(commandServices)) {
            let definition = container.getDefinition(id);
            let className = container.parameterBag.resolveValue(definition.getClass());

            let r;
            try {
                r = new ReflectionClass(className);
            } catch (e) {
                if (e instanceof ReflectionException) {
                    let message = __jymfony.sprintf('Class "%s" used for service "%s" cannot be found.', className, id);
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
                container.setAlias(commandId, id);
                id = commandId;
            }

            serviceIds[commandId] = id;
        }

        container.setParameter('console.command.ids', Object.values(serviceIds));
    }
}

module.exports = AddConsoleCommandPass;
