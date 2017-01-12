const ServiceReferenceGraphEdge = Jymfony.DependencyInjection.Compiler.ServiceReferenceGraphEdge;
const ServiceReferenceGraphNode = Jymfony.DependencyInjection.Compiler.ServiceReferenceGraphNode;

/**
 * Graph representation of services
 *
 * Use this in compiler passes instead of collecting these info
 * in every pass
 *
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @internal
 */
module.exports = class ServiceReferenceGraph {
    constructor() {
        this.clear();
    }

    hasNode(id) {
        return this._nodes[id] !== undefined;
    }

    getNode(id) {
        if (! this._nodes[id]) {
            throw new InvalidArgumentException(`There is no node with id "${id}"`);
        }

        return this._nodes[id];
    }

    getNodes() {
        return Object.assign({}, this._nodes);
    }

    clear() {
        this._nodes = {};
    }

    connect(sourceId, sourceValue, destId, destValue = null, reference = null) {
        let sourceNode = this._createNode(sourceId, sourceValue);
        let destNode = this._createNode(destId, destValue);
        let edge = new ServiceReferenceGraphEdge(sourceNode, destNode, reference);

        sourceNode.addOutEdge(edge);
        destNode.addInEdge(edge);
    }

    _createNode(id, value) {
        if (this._nodes[id] && this._nodes[id].getValue() === value) {
            return this._nodes[id];
        }

        return this._nodes[id] = new ServiceReferenceGraphNode(id, value);
    }
};
