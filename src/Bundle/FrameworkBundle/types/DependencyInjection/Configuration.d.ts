declare namespace Jymfony.Bundle.FrameworkBundle.DependencyInjection {
    import TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;
    import ArrayNodeDefinition = Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition;
    import ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;

    export class Configuration extends implementationOf(ConfigurationInterface) {
        /**
         * @inheritdoc
         */
        public readonly configTreeBuilder: TreeBuilder;

        private _addConsoleSection(rootNode: ArrayNodeDefinition): void;

        private _addDebugSection(rootNode: ArrayNodeDefinition): void;

        private _addLoggerSection(rootNode: ArrayNodeDefinition): void;

        private _addRouterSection(rootNode: ArrayNodeDefinition): void;

        private _addHttpClientSection(rootNode: ArrayNodeDefinition): void;

        private _addMessengerSection(rootNode: ArrayNodeDefinition): void;

        private _addHttpClientRetrySection(): void;

        private _addHttpServerSection(rootNode: ArrayNodeDefinition): void;

        private _addCacheSection(rootNode: ArrayNodeDefinition): void;

        private _addSessionSection(rootNode: ArrayNodeDefinition): void;

        private _addTemplatingSection(rootNode: ArrayNodeDefinition): void;

        private _addValidationSection(rootNode: ArrayNodeDefinition): void;
    }
}
