const NodeBuilder = Jymfony.Component.Config.Definition.Builder.NodeBuilder;

class CustomNodeBuilder extends NodeBuilder {
    /**
     * @inheritdoc
     */
    __construct(fixturesNs) {
        super.__construct();

        this._fixturesNs = fixturesNs;
    }

    /**
     * @param {string} name
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    barNode(name) {
        return this.node(name, 'bar');
    }

    /**
     * @inheritdoc
     */
    node(name, type) {
        const n = super.node(name, type);
        if ('bar' === type) {
            n.fixturesNs = this._fixturesNs;
        }

        return n;
    }

    /**
     * @inheritdoc
     */
    _getNodeClass(type) {
        switch (type) {
            case 'bar': {
                return this._fixturesNs.Definition.BarNodeDefinition;
            }

            case 'variable':
                return this._fixturesNs.Definition.VariableNodeDefinition;
        }

        return super._getNodeClass(type);
    }
}

module.exports = CustomNodeBuilder;
