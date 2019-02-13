declare namespace Jymfony.Component.Config.Definition {
    export class Processor {
        /**
         * Processes an array of configurations.
         *
         * @param configTree The node tree describing the configuration
         * @param configs An array of configuration items to process
         *
         * @returns The processed configuration
         */
        process(configTree: NodeInterface, configs: any[]): any;

        /**
         * Processes an array of configurations.
         *
         * @param configuration The configuration class
         * @param configs An array of configuration items to process
         *
         * @returns The processed configuration
         */
        processConfiguration(configuration: ConfigurationInterface, configs: any[]): any;
    }
}
