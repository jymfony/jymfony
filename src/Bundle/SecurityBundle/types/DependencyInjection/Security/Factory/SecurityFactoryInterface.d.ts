declare namespace Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import NodeBuilder = Jymfony.Component.Config.Definition.Builder.NodeBuilder;

    /**
     * SecurityFactoryInterface is the interface for all security authentication listener.
     */
    export class SecurityFactoryInterface {
        public static readonly definition: Newable<SecurityFactoryInterface>;

        /**
         * Configures the container services required to use the authentication listener.
         */
        create(container: ContainerBuilder, id: string, config: Record<string, any>, userProvider: string, defaultEntryPoint: string): [string, string, string];

        /**
         * Defines the position at which the provider is called.
         * Possible values: pre_auth, form, http, and remember_me.
         */
        getPosition(): 'pre_auth' | 'form' | 'http' | 'remember_me';

        /**
         * Defines the configuration key used to reference the provider
         * in the firewall configuration.
         */
        getKey(): string;

        /**
         * Adds configuration nodes for security configuration.
         *
         * @param {Jymfony.Component.Config.Definition.Builder.NodeBuilder} builder
         */
        addConfiguration(builder: NodeBuilder): void;
    }
}
