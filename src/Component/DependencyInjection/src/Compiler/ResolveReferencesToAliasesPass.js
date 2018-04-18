const Alias = Jymfony.Component.DependencyInjection.Alias;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.ResolveReferencesToAliasesPass}
 */
class ResolveReferencesToAliasesPass extends AbstractRecursivePass {
    /**
     * @inheritDoc
     */
    process(container) {
        super.process(container);

        for (const [ id, alias ] of __jymfony.getEntries(container.getAliases())) {
            const aliasId = alias.toString();
            const defId = this._getDefinitionId(aliasId, container);

            if (aliasId !== defId) {
                container.setAlias(id, new Alias(defId, alias.isPublic()));
            }
        }
    }

    _processValue(value) {
        if (value instanceof Reference) {
            const id = value.toString();
            const defId = this._getDefinitionId(id, this._container);

            if (defId !== id) {
                return new Reference(defId, value.invalidBehavior);
            }
        }

        return super._processValue(value);
    }

    _getDefinitionId(id, container) {
        const seen = {};
        while (container.hasAlias(id)) {
            if (seen[id]) {
                throw new ServiceCircularReferenceException(id, Object.keys(seen));
            }

            seen[id] = true;
            id = container.getAlias(id).toString();
        }

        return id;
    }
}

module.exports = ResolveReferencesToAliasesPass;
