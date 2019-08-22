const RepeatablePassInterface = Jymfony.Component.DependencyInjection.Compiler.RepeatablePassInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class RemoveUnusedDefinitionsPass extends implementationOf(RepeatablePassInterface) {
    __construct() {
        this._repeatedPass = undefined;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        const compiler = container.getCompiler();
        const formatter = compiler.logFormatter;
        const graph = compiler.getServiceReferenceGraph();

        let hasChanged = false;
        for (const [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            if (definition.isPublic()) {
                continue;
            }

            let isReferenced, referencingAliases;
            if (graph.hasNode(id)) {
                const edges = graph.getNode(id).getInEdges();
                referencingAliases = [];
                const sourceIds = new Set();

                for (const edge of edges) {
                    const node = edge.getSourceNode();
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
     * @inheritdoc
     */
    setRepeatedPass(pass) {
        this._repeatedPass = pass;
    }
}
