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
        this._inlinedServiceIds = {};
    }

    /**
     * @inheritDoc
     */
    setRepeatedPass() {
        // No-op
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

        if (value instanceof Definition && 0 < Object.keys(this._inlinedServiceIds).length) {
            if (value.isShared()) {
                return value;
            }

            value = __jymfony.deepClone(definition);
        }

        if (!(value instanceof Reference) || !this._container.hasDefinition(value.toString())) {
            return super._processValue(value, isRoot);
        }

        const id = value.toString();
        const definition = this._container.getDefinition(id);
        if (! this._isInlineableDefinition(id, definition, this._container.getCompiler().getServiceReferenceGraph())) {
            return value;
        }

        this._container.log(this, __jymfony.sprintf('Inlined service "%s" to "%s".', id, this._currentId));

        if (definition.isShared()) {
            return definition;
        }

        if (undefined === this._inlinedServiceIds[id]) {
            this._inlinedServiceIds[id] = [];
        }
        this._inlinedServiceIds[id].push(this._currentId);

        try {
            return super._processValue(value, isRoot);
        } finally {
            delete this._inlinedServiceIds[id];
        }
    }

    /**
     * Checks whether a service could be inlined.
     *
     * @param {string} id
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     * @param {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraph} graph
     *
     * @returns {boolean}
     *
     * @private
     */
    _isInlineableDefinition(id, definition, graph) {
        if (definition.isDeprecated() || definition.isLazy() || definition.isSynthetic()) {
            return false;
        }

        if (! definition.isShared()) {
            return true;
        }

        if (definition.isPublic()) {
            return false;
        }

        if (! graph.hasNode(id)) {
            return true;
        }

        if (this._currentId === id) {
            return false;
        }

        const ids = [];
        for (const edge of graph.getNode(id).getInEdges()) {
            ids.push(edge.getSourceNode().getId());
        }

        if (1 < [ ...new Set(ids) ].length) {
            return false;
        }

        let factory;
        if (1 < ids.length && isArray(factory = definition.getFactory()) && (factory[0] instanceof Reference || factory[0] instanceof Definition)) {
            return false;
        }

        return 0 === Object.keys(ids).length || this._container.getDefinition(ids[0]).isShared();
    }
}

module.exports = InlineServiceDefinitionsPass;
