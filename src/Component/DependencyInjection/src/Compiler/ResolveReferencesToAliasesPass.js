const Alias = Jymfony.DependencyInjection.Alias;
const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const ServiceCircularReferenceException = Jymfony.DependencyInjection.Exception.ServiceCircularReferenceException;
const Reference = Jymfony.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ResolveReferencesToAliasesPass}
 */
module.exports = class ResolveReferencesToAliasesPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        this._container = container;

        for (let definition of Object.values(container.getDefinitions())) {
            if (definition.isSynthetic() || definition.isAbstract()) {
                continue;
            }

            definition.setArguments(this._processArguments(definition.getArguments()));
            definition.setMethodCalls(this._processArguments(definition.getMethodCalls()));
            definition.setProperties(this._processArguments(definition.getProperties()));
            definition.setFactory(this._processFactory(definition.getFactory()));
        }

        for (let [id, alias] of __jymfony.getEntries(container.getAliases())) {
            let aliasId = alias.toString();
            let defId = this._getDefinitionId(aliasId);

            if (aliasId !== defId) {
                container.setAlias(id, new Alias(defId, alias.isPublic()));
            }
        }
    }

    _processArguments(args) {
        for (let [k, argument] of __jymfony.getEntries(args)) {
            if (isArray(argument)) {
                args[k] = this._processArguments(argument);
            } else if (argument instanceof Reference) {
                let id = argument.toString();
                let defId = this._getDefinitionId(id);

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

        let id = factory[0].toString();
        let defId = this._getDefinitionId(id);

        if (defId !== id) {
            factory[0] = new Reference(defId, factory[0].invalidBehavior);
        }

        return factory;
    }

    _getDefinitionId(id) {
        let seen = {};
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
