/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ServiceReferenceGraphEdge}
 */
module.exports = class ServiceReferenceGraphEdge {
    constructor(sourceNode, destNode, value = undefined) {
        this._sourceNode = sourceNode;
        this._destNode = destNode;
        this._value = value;
    }

    getValue() {
        return this._value;
    }

    getSourceNode() {
        return this._sourceNode;
    }

    getDestNode() {
        return this._destNode;
    }
};
