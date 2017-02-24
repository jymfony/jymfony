const Alias = Jymfony.Component.DependencyInjection.Alias;
const Definition = Jymfony.Component.DependencyInjection.Definition;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode}
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
