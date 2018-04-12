const NodeDefinition = Jymfony.Component.Config.Definition.Builder.NodeDefinition;

module.exports = class BarNodeDefinition extends NodeDefinition {
    createNode() {
        return new this._fixturesNs.BarNode(this._name);
    }

    set fixturesNs(ns) {
        this._fixturesNs = ns;
    }
};
