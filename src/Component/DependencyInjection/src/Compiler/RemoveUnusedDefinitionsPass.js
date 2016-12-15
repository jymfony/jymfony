const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const RepeatablePassInterface = Jymfony.DependencyInjection.Compiler.RepeatablePassInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.RemoveUnusedDefinitionsPass}
 */
module.exports = class RemoveUnusedDefinitionsPass extends implementationOf(CompilerPassInterface, RepeatablePassInterface) {
    process(container) {
        let compiler = container.getCompiler();
        let formatter = compiler.logFormatter;
        let graph = compiler.getServiceReferenceGraph();

        let hasChanged = false;
        for (let [id, definition] of __jymfony.getEntries(container.getDefinitions())) {
            if (definition.isPublic()) {
                continue;
            }

            let isReferenced, referencingAliases;
            if (graph.hasNode(id)) {
                let edges = graph.getNode(id).getInEdges();
                let referencingAliases = [];
                let sourceIds = new Set;

                for (let edge of edges) {
                    let node = edge.getSourceNode();
                    sourceIds.add(node.getId());

                    if (node.isAlias()) {
                        referencingAliases.push(node.getValue());
                    }
                }

                isReferenced = sourceIds.size - referencingAliases.length > 0;
            } else {
                referencingAliases = [];
                isReferenced = false;
            }

            if (1 === referencingAliases.length && ! isReferenced) {
                container.setDefinition(referencingAliases[0].toString(), definition);
                definition.setPublic(true);
                container.removeDefinition(id);
                compiler.addLogMessage(formatter.formatRemoveService(this, id, 'replaces alias ' + referencingAliases[0].toString()));
            } else if (0 === count(referencingAliases) && ! isReferenced) {
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
