/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge}
 */
module.exports = class ServiceReferenceGraphEdge {
    __construct(sourceNode, destNode, value = undefined) {
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
