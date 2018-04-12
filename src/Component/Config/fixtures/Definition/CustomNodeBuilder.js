const NodeBuilder = Jymfony.Component.Config.Definition.Builder.NodeBuilder;

module.exports = class CustomNodeBuilder extends NodeBuilder {
    __construct(fixturesNs) {
        super.__construct();

        this._fixturesNs = fixturesNs;
    }

    barNode(name) {
        return this.node(name, 'bar');
    }

    node(name, type) {
        const n = super.node(name, type);
        if ('bar' === type) {
            n.fixturesNs = this._fixturesNs;
        }

        return n;
    }

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
};
