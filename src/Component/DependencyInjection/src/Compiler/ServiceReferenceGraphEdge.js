/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class ServiceReferenceGraphEdge {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode} sourceNode
     * @param {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode} destinationNode
     * @param {*} [value]
     */
    __construct(sourceNode, destinationNode, value = undefined) {
        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode}
         *
         * @private
         */
        this._sourceNode = sourceNode;

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode}
         *
         * @private
         */
        this._destinationNode = destinationNode;

        /**
         * @type {*}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * @returns {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode}
     */
    getSourceNode() {
        return this._sourceNode;
    }

    /**
     * @returns {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode}
     */
    getDestinationNode() {
        return this._destinationNode;
    }

    /**
     * @returns {*}
     */
    getValue() {
        return this._value;
    }
}

module.exports = ServiceReferenceGraphEdge;
