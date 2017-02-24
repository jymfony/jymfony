const RepeatablePassInterface = Jymfony.Component.DependencyInjection.Compiler.RepeatablePassInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.RemoveUnusedDefinitionsPass}
 */
module.exports = class RemoveUnusedDefinitionsPass extends implementationOf(RepeatablePassInterface) {
    process(container) {
        let compiler = container.getCompiler();
        let formatter = compiler.logFormatter;
        let graph = compiler.getServiceReferenceGraph();

        let hasChanged = false;
        for (let [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            if (definition.isPublic()) {
                continue;
            }

            let isReferenced, referencingAliases;
            if (graph.hasNode(id)) {
                let edges = graph.getNode(id).getInEdges();
                referencingAliases = [];
                let sourceIds = new Set;

                for (let edge of edges) {
                    let node = edge.getSourceNode();
                    sourceIds.add(node.getId());

                    if (node.isAlias()) {
                        referencingAliases.push(node.getValue());
                    }
                }

                isReferenced = 0 < sourceIds.size - referencingAliases.length;
            } else {
                referencingAliases = [];
                isReferenced = false;
            }

            if (1 === referencingAliases.length && ! isReferenced) {
                container.setDefinition(referencingAliases[0].toString(), definition);
                definition.setPublic(true);
                container.removeDefinition(id);
                compiler.addLogMessage(formatter.formatRemoveService(this, id, 'replaces alias ' + referencingAliases[0].toString()));
            } else if (0 === referencingAliases.length && ! isReferenced) {
                container.removeDefinition(id);
                compiler.addLogMessage(formatter.formatRemoveService(this, id, 'unused'));
                hasChanged = true;
            }
        }

        if (hasChanged) {
            this._repeatedPass.setRepeat();
        }
    }

    /**
     * @inheritDoc
     */
    setRepeatedPass(pass) {
        this._repeatedPass = pass;
    }
};
