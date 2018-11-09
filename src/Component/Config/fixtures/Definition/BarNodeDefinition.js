const NodeDefinition = Jymfony.Component.Config.Definition.Builder.NodeDefinition;

class BarNodeDefinition extends NodeDefinition {
    __construct() {
        this._fixturesNs = undefined;
        this._parent = undefined;
    }

    /**
     * @inheritdoc
     */
    createNode() {
        return new this._fixturesNs.BarNode(this._name);
    }

    /**
     * @param {string} ns
     */
    set fixturesNs(ns) {
        this._fixturesNs = ns;
    }
}

module.exports = BarNodeDefinition;
