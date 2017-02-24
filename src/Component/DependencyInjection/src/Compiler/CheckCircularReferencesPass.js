const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.CheckCircularReferencesPass}
 */
module.exports = class CheckCircularReferencesPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        let graph = container.getCompiler().getServiceReferenceGraph();

        this._checkedNodes = {};
        for (let [ id, node ] of __jymfony.getEntries(graph.getNodes())) {
            this._currentPath = [ id ];
            this._checkOutEdges(node.getOutEdges());
        }
    }

    _checkOutEdges(edges) {
        for (let edge of edges) {
            let node = edge.getDestNode();
            let id = node.getId();

            if (! this._checkedNodes[id] || 0 == this._checkedNodes[id].length) {
                // Don't check circular dependencies for lazy services
                if (! node.getValue() || ! node.getValue().isLazy()) {
                    let searchKey = this._currentPath.indexOf(id);
                    this._currentPath.push(id);

                    if (-1 !== searchKey) {
                        throw new ServiceCircularReferenceException(id, this._currentPath.slice(searchKey));
                    }

                    this._checkOutEdges(node.getOutEdges());
                }

                this._checkedNodes[id] = true;
                this._currentPath.pop();
            }
        }
    }
};
