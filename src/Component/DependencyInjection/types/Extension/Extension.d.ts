declare namespace Jymfony.Component.DependencyInjection.Extension {
    import ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;

    /**
     * Abstract extension.
     */
    export class Extension extends implementationOf(ExtensionInterface) {
        /**
         * @inheritdoc
         */
        public readonly namespace: string;

        /**
         * @inheritdoc
         */
        public readonly alias: string;

        /**
         * @inheritdoc
         */
        public readonly xsdValidationBasePath: string;

        private _processedConfigs: any[];

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Returns the extension configuration object.
         */
        getConfiguration(config: any[], container: ContainerBuilder): ConfigurationInterface;

        protected _processConfiguration(configuration: ConfigurationInterface, configs: any[]): any;

        protected _isConfigEnabled(container: ContainerBuilder, config: any): any;
    }
}
