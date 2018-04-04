/* eslint-disable indent */

const ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;
const TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection
 */
class Configuration extends implementationOf(ConfigurationInterface) {
    /**
     * @inheritDoc
     */
    get configTreeBuilder() {
        const treeBuilder = new TreeBuilder();
        const rootNode = treeBuilder.root('framework');

        this._addRouterSection(rootNode);
        this._addHttpServerSection(rootNode);

        return treeBuilder;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     * @private
     */
    _addRouterSection(rootNode) {
        rootNode
            .children()
                .arrayNode('router')
                .info('router configuration')
                .canBeEnabled()
                .children()
                    .scalarNode('resource').isRequired().end()
                    .scalarNode('type').end()
                .end()
            .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     * @private
     */
    _addHttpServerSection(rootNode) {
        rootNode
            .children()
                .arrayNode('http_server')
                .info('http server configuration')
                .canBeEnabled()
            .end()
        ;
    }
}

module.exports = Configuration;
