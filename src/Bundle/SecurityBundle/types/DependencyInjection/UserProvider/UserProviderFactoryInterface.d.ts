declare namespace Jymfony.Bundle.SecurityBundle.DependencyInjection.UserProvider {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import NodeDefinition = Jymfony.Component.Config.Definition.Builder.NodeDefinition;

    /**
     * UserProviderFactoryInterface is the interface for all user provider factories.
     */
    export class UserProviderFactoryInterface {
        public static readonly definition: Newable<UserProviderFactoryInterface>;

        /**
         * Creates the user provider service.
         */
        create(container: ContainerBuilder, id: string, config: Record<string, any>): void;

        /**
         * Gets the user provider factory key (used in configuration).
         */
        getKey(): string;

        /**
         * Adds the configuration to the node builder.
         */
        addConfiguration(builder: NodeDefinition): void;
    }
}
