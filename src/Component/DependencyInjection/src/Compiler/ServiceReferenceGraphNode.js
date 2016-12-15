const Alias = Jymfony.DependencyInjection.Alias;
const Definition = Jymfony.DependencyInjection.Definition;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ServiceReferenceGraphNode}
 */
module.exports = class ServiceReferenceGraphNode {
    constructor(id, value) {
        this._id = id;
        this._value = value;

        this._inEdges = [];
        this._outEdges = [];
    }

    addInEdge(edge) {
        this._inEdges.push(edge);
    }

    addOutEdge(edge) {
        this._outEdges.push(edge);
    }

    isAlias() {
        return this._value instanceof Alias;
    }

    isDefinition() {
        return this._value instanceof Definition;
    }

    getId() {
        return this._id;
    }

    getInEdges() {
        return [ ...this._inEdges ];
    }

    getOutEdges() {
        return [ ...this._outEdges ];
    }

    getValue() {
        return this._value;
    }
};
