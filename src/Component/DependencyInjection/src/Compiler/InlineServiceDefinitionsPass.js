const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class InlineServiceDefinitionsPass extends AbstractRecursivePass {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Compiler.AnalyzeServiceReferencesPass} analyzingPass
     */
    __construct(analyzingPass = null) {
        super.__construct();

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.AnalyzeServiceReferencesPass}
         *
         * @private
         */
        this._analyzingPass = analyzingPass;

        /**
         * @type {Object}
         *
         * @private
         */
        this._inlinedIds = {};

        /**
         * @type {Object}
         *
         * @private
         */
        this._notInlinedIds = {};

        /**
         * @type {Object}
         *
         * @private
         */
        this._connectedIds = {};

        /**
         * @type {Set<string>}
         *
         * @private
         */
        this._cloningIds = new Set();

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraph}
         *
         * @private
         */
        this._graph = undefined;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        this._container = container;

        let analyzedContainer;
        if (this._analyzingPass) {
            analyzedContainer = new ContainerBuilder();
            analyzedContainer.setAliases(container.getAliases());
            analyzedContainer.setDefinitions(container.getDefinitions());
        } else {
            analyzedContainer = container;
        }

        try {
            const remainingInlinedIds = {};
            this._connectedIds = container.getDefinitions();
            this._notInlinedIds = container.getDefinitions();

            do {
                if (this._analyzingPass) {
                    analyzedContainer.setDefinitions(__jymfony.intersect_key(analyzedContainer.getDefinitions(), this._connectedIds));
                    this._analyzingPass.process(analyzedContainer);
                }

                this._graph = analyzedContainer.getCompiler().getServiceReferenceGraph();
                const notInlinedIds = this._notInlinedIds;
                this._connectedIds = {};
                this._notInlinedIds = {};
                this._inlinedIds = {};

                for (const [ id, definition ] of __jymfony.getEntries(analyzedContainer.getDefinitions())) {
                    if (! this._graph.hasNode(id)) {
                        continue;
                    }

                    for (const edge of this._graph.getNode(id).getOutEdges()) {
                        if (undefined !== notInlinedIds[edge.getSourceNode().getId()]) {
                            this._currentId = id;
                            this._processValue(definition, true);
                            break;
                        }
                    }
                }

                for (const [ id, isPublicOrNotShared ] of __jymfony.getEntries(this._inlinedIds)) {
                    if (isPublicOrNotShared) {
                        remainingInlinedIds[id] = id;
                    } else {
                        container.removeDefinition(id);
                        analyzedContainer.removeDefinition(id);
                    }
                }
            } while (0 < Object.keys(this._inlinedIds).length && null !== this._analyzingPass);

            for (const id of Object.values(remainingInlinedIds)) {
                const definition = container.getDefinition(id);

                if (! definition.isShared() && ! definition.isPublic()) {
                    container.removeDefinition(id);
                }
            }
        } finally {
            this._container = undefined;
            this._connectedIds = {};
            this._notInlinedIds = {};
            this._inlinedIds = {};
            this._graph = undefined;
        }
    }

    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (value instanceof ArgumentInterface) {
            return value;
        }

        if (value instanceof Definition && 0 < this._cloningIds.size) {
            if (value.isShared()) {
                return value;
            }

            value = __jymfony.clone(value);
        }

        if (!(value instanceof Reference)) {
            return super._processValue(value, isRoot);
        } else if (! this._container.hasDefinition(String(value))) {
            return value;
        }

        const id = value.toString();
        const definition = this._container.getDefinition(id);
        if (! this._isInlineableDefinition(id, definition)) {
            return value;
        }

        const compiler = this._container.getCompiler();
        const formatter = compiler.logFormatter;

        compiler.addLogMessage(formatter.formatInlineService(this, id, this._currentId));
        this._inlinedIds[id] = definition.isPublic() || ! definition.isShared();
        this._notInlinedIds[this._currentId] = true;

        if (definition.isShared()) {
            return definition;
        }

        if (this._cloningIds.has(id)) {
            const ids = this._cloningIds.values();
            ids.push(id);

            throw new ServiceCircularReferenceException(id, ids.slice(ids, ids.indexOf(id)));
        }

        this._cloningIds.add(id);

        try {
            return super._processValue(value);
        } finally {
            this._cloningIds.delete(id);
        }
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
    _isInlineableDefinition(id, definition) {
        if (definition.hasErrors() || definition.isDeprecated() || definition.isLazy() || definition.isSynthetic()) {
            return false;
        }

        let srcId;
        if (! definition.isShared()) {
            if (! this._graph.hasNode(id)) {
                return true;
            }

            for (const edge of this._graph.getNode(id).getInEdges()) {
                srcId = edge.getSourceNode().getId();
                this._connectedIds[srcId] = true;
                if (edge.isWeak() || edge.isLazy()) {
                    return false;
                }
            }

            return true;
        }

        if (definition.isPublic()) {
            return false;
        }

        if (! this._graph.hasNode(id)) {
            return true;
        }

        if (this._currentId === id) {
            return false;
        }

        this._connectedIds[id] = true;

        const ids = [];
        let srcCount = 0;
        for (const edge of this._graph.getNode(id).getInEdges()) {
            srcId = edge.getSourceNode().getId();

            this._connectedIds[srcId] = true;
            if (edge.isWeak() || edge.isLazy()) {
                return false;
            }

            ids.push(srcId);
            ++srcCount;
        }

        if (1 < [ ...new Set(ids) ].length) {
            this._notInlinedIds[id] = true;

            return false;
        }

        let factory;
        if (1 < srcCount && isArray(factory = definition.getFactory()) && (factory[0] instanceof Reference || factory[0] instanceof Definition)) {
            return false;
        }

        return this._container.getDefinition(srcId).isShared();
    }
}
