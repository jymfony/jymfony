const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const RepeatablePassInterface = Jymfony.Component.DependencyInjection.Compiler.RepeatablePassInterface;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class InlineServiceDefinitionsPass extends mix(AbstractRecursivePass, RepeatablePassInterface) {
    __construct() {
        this._repeatedPass = undefined;
        this._inlinedServiceIds = {};
    }

    /**
     * @inheritDoc
     */
    setRepeatedPass(pass) {
        this._repeatedPass = pass;
    }

    /**
     * @inheritDoc
     */
    get inlinedServiceIds() {
        return Object.assign({}, this._inlinedServiceIds);
    }

    _processValue(value, isRoot = false) {
        if (value instanceof ArgumentInterface) {
            return value;
        }

        if (value instanceof Reference && this._container.hasDefinition(value.toString())) {
            let id = value.toString();
            let definition = this._container.getDefinition(id);

            if (this._isInlineableDefinition(id, definition, this._container.getCompiler().getServiceReferenceGraph())) {
                this._container.log(this, __jymfony.sprintf('Inlined service "%s" to "%s".', id, this._currentId));

                if (undefined === this._inlinedServiceIds[id]) {
                    this._inlinedServiceIds[id] = [];
                }
                this._inlinedServiceIds[id].push(this._currentId);

                if (definition.isShared()) {
                    return definition;
                }

                value = __jymfony.deepClone(definition);
            }
        }

        return super._processValue(value, isRoot);
    }

    /**
     * Checks whether a service could be inlined.
     *
     * @param {string} id
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     *
     * @returns {boolean}
     *
     * @private
     */
    _isInlineableDefinition(id, definition, graph) {
        if (definition.isDeprecated()) {
            return false;
        }

        if (! definition.isShared()) {
            return true;
        }

        if (definition.isPublic() || definition.isLazy()) {
            return false;
        }

        if (! graph.hasNode(id)) {
            return true;
        }

        if (this._currentId === id) {
            return false;
        }

        let ids = [];
        for (let edge of graph.getNode(id).getInEdges()) {
            ids.push(edge.getSourceNode().getId());
        }

        if (1 < [ ...new Set(ids) ].length) {
            return false;
        }

        let factory;
        if (1 < ids.length && isArray(factory = definition.getFactory()) && (factory[0] instanceof Reference || factory[0] instanceof Definition)) {
            return false;
        }

        return true;
    }
}

module.exports = InlineServiceDefinitionsPass;
