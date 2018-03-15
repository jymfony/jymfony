/**
 * @memberOf Jymfony.Component.Config.Definition
 */
class Processor {
    /**
     * Processes an array of configurations.
     *
     * @param {Jymfony.Component.Config.Definition.NodeInterface} configTree The node tree describing the configuration
     * @param {[Object]} configs An array of configuration items to process
     *
     * @return {Object} The processed configuration
     */
    process(configTree, configs) {
        let currentConfig = {};
        for (let config of configs) {
            config = configTree.normalize(config);
            currentConfig = configTree.merge(currentConfig, config);
        }

        return configTree.finalize(currentConfig);
    }

    /**
     * Processes an array of configurations.
     *
     * @param {ConfigurationInterface} configuration The configuration class
     * @param {array}                  configs       An array of configuration items to process
     *
     * @return array The processed configuration
     */
    processConfiguration(configuration, configs) {
        return this.process(configuration.configTreeBuilder.buildTree(), configs);
    }
}

module.exports = Processor;
