const Alias = Jymfony.Component.DependencyInjection.Alias;
const Definition = Jymfony.Component.DependencyInjection.Definition;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ServiceReferenceGraphNode {
    /**
     * Constructor.
     *
     * @param {string} id
     * @param {*} value
     */
    __construct(id, value) {
        /**
         * @type {string}
         *
         * @private
         */
        this._id = id;

        /**
         * @type {*}
         *
         * @private
         */
        this._value = value;

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge[]}
         *
         * @private
         */
        this._inEdges = [];

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge[]}
         *
         * @private
         */
        this._outEdges = [];
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge} edge
     */
    addInEdge(edge) {
        this._inEdges.push(edge);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge} edge
     */
    addOutEdge(edge) {
        this._outEdges.push(edge);
    }

    /**
     * @returns {boolean}
     */
    isAlias() {
        return this._value instanceof Alias;
    }

    /**
     * @returns {boolean}
     */
    isDefinition() {
        return this._value instanceof Definition;
    }

    /**
     * @returns {string}
     */
    getId() {
        return this._id;
    }

    /**
     * @returns {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge[]}
     */
    getInEdges() {
        return [ ...this._inEdges ];
    }

    /**
     * @returns {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge[]}
     */
    getOutEdges() {
        return [ ...this._outEdges ];
    }

    /**
     * @returns {*}
     */
    getValue() {
        return this._value;
    }
}
