const ServiceReferenceGraphEdge = Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge;
const ServiceReferenceGraphNode = Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode;

/**
 * Graph representation of services.
 *
 * Use this in compiler passes instead of collecting these info
 * in every pass.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 *
 * @internal
 */
export default class ServiceReferenceGraph {
    /**
     * Constructor.
     */
    __construct() {
        this.clear();
    }

    /**
     * @param {string} id
     *
     * @returns {boolean}
     */
    hasNode(id) {
        return undefined !== this._nodes[id];
    }

    /**
     * @param {string} id
     *
     * @returns {Object}
     *
     * @throws InvalidArgumentException
     */
    getNode(id) {
        if (! this._nodes[id]) {
            throw new InvalidArgumentException(`There is no node with id "${id}"`);
        }

        return this._nodes[id];
    }

    /**
     * @returns {Object}
     */
    getNodes() {
        return Object.assign({}, this._nodes);
    }

    clear() {
        this._nodes = {};
    }

    /**
     * @param {string} sourceId
     * @param {*} sourceValue
     * @param {string} destinationId
     * @param {*} [destinationValue]
     * @param {*} [reference]
     * @param {boolean} [lazy = false]
     * @param {boolean} [weak = false]
     */
    connect(sourceId, sourceValue, destinationId, destinationValue = undefined, reference = undefined, lazy = false, weak = false) {
        if (! sourceId || ! destinationId) {
            return;
        }

        const sourceNode = this._createNode(sourceId, sourceValue);
        const destNode = this._createNode(destinationId, destinationValue);
        const edge = new ServiceReferenceGraphEdge(sourceNode, destNode, reference, lazy, weak);

        sourceNode.addOutEdge(edge);
        destNode.addInEdge(edge);
    }

    /**
     * @param {string} id
     * @param {*} value
     *
     * @returns {*}
     *
     * @private
     */
    _createNode(id, value) {
        if (this._nodes[id] && this._nodes[id].getValue() === value) {
            return this._nodes[id];
        }

        return this._nodes[id] = new ServiceReferenceGraphNode(id, value);
    }
}
