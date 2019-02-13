declare namespace Jymfony.Bundle.SecurityBundle.DependencyInjection {
    import ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;
    import UserProviderFactoryInterface = Jymfony.Bundle.SecurityBundle.DependencyInjection.UserProvider.UserProviderFactoryInterface;
    import SecurityFactoryInterface = Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.SecurityFactoryInterface;
    import TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;
    import ArrayNodeDefinition = Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition;

    export class Configuration extends implementationOf(ConfigurationInterface) {
        private _userProviderFactories: UserProviderFactoryInterface[];
        private _factories: Record<string, SecurityFactoryInterface>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        public /* writeonly */ userProviderFactories: UserProviderFactoryInterface[];

        /**
         * @param {Object.<string, Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.SecurityFactoryInterface>} factories
         */
        public /* writeonly */ factories: Record<string, SecurityFactoryInterface>;

        /**
         * @inheritdoc
         */
        public readonly configTreeBuilder: TreeBuilder;

        private _addRoleHierarchySection(rootNode: ArrayNodeDefinition): void;

        private _addAccessControlSection(rootNode: ArrayNodeDefinition): void;

        private _addFirewallsSection(rootNode: ArrayNodeDefinition): void;

        private _addProvidersSection(rootNode: ArrayNodeDefinition): void;;

        private _addEncodersSection(rootNode: ArrayNodeDefinition): void;
    }
}
