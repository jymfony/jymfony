/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ServiceReferenceGraphEdge {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode} sourceNode
     * @param {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode} destinationNode
     * @param {*} [value]
     * @param {boolean} [lazy = false]
     * @param {boolean} [weak = false]
     */
    __construct(sourceNode, destinationNode, value = undefined, lazy = false, weak = false) {
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

        /**
         * @type {boolean}
         *
         * @private
         */
        this._lazy = lazy;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._weak = weak;
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

    /**
     * @returns {boolean}
     */
    isLazy() {
        return this._lazy;
    }

    /**
     * @returns {boolean}
     */
    isWeak() {
        return this._weak;
    }
}
