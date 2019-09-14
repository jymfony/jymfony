const Alias = Jymfony.Component.DependencyInjection.Alias;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveReferencesToAliasesPass extends AbstractRecursivePass {
    /**
     * @inheritdoc
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

    /**
     * @inheritdoc
     */
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

    /**
     * @param {string} id
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @returns {string}
     *
     * @private
     */
    _getDefinitionId(id, container) {
        if (! container.hasAlias(id)) {
            return id;
        }

        const alias = container.getAlias(id);

        if (alias.isDeprecated()) {
            __jymfony.trigger_deprecated(__jymfony.sprintf('%s. It is being referenced by the "%s" %s.', __jymfony.rtrim(alias.getDeprecationMessage(id), '. '), this._currentId, container.hasDefinition(this._currentId) ? 'service' : 'alias'));
        }

        const seen = {};
        do {
            if (undefined !== seen[id]) {
                throw new ServiceCircularReferenceException(id, [ ...Object.keys(seen), id ]);
            }

            seen[id] = true;
            id = container.getAlias(id).toString();
        } while (container.hasAlias(id));

        return id;
    }
}
