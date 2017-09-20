const Alias = Jymfony.Component.DependencyInjection.Alias;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.ResolveReferencesToAliasesPass}
 */
module.exports = class ResolveReferencesToAliasesPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        this._container = container;

        for (const definition of Object.values(container.getDefinitions())) {
            if (definition.isSynthetic() || definition.isAbstract()) {
                continue;
            }

            definition.setArguments(this._processArguments(definition.getArguments()));
            definition.setMethodCalls(this._processArguments(definition.getMethodCalls()));
            definition.setProperties(this._processArguments(definition.getProperties()));
            definition.setFactory(this._processFactory(definition.getFactory()));
        }

        for (const [ id, alias ] of __jymfony.getEntries(container.getAliases())) {
            const aliasId = alias.toString();
            const defId = this._getDefinitionId(aliasId);

            if (aliasId !== defId) {
                container.setAlias(id, new Alias(defId, alias.isPublic()));
            }
        }
    }

    _processArguments(args) {
        for (const [ k, argument ] of __jymfony.getEntries(args)) {
            if (isArray(argument)) {
                args[k] = this._processArguments(argument);
            } else if (argument instanceof Reference) {
                const id = argument.toString();
                const defId = this._getDefinitionId(id);

                if (defId !== id) {
                    args[k] = new Reference(defId, argument.invalidBehavior);
                }
            }
        }

        return args;
    }

    _processFactory(factory) {
        if (! factory || ! isArray(factory) || ! (factory[0] instanceof Reference)) {
            return factory;
        }

        const id = factory[0].toString();
        const defId = this._getDefinitionId(id);

        if (defId !== id) {
            factory[0] = new Reference(defId, factory[0].invalidBehavior);
        }

        return factory;
    }

    _getDefinitionId(id) {
        const seen = {};
        while (this._container.hasAlias(id)) {
            if (seen[id]) {
                throw new ServiceCircularReferenceException(id, Object.keys(seen));
            }

            seen[id] = true;
            id = this._container.getAlias(id).toString();
        }

        return id;
    }
};
