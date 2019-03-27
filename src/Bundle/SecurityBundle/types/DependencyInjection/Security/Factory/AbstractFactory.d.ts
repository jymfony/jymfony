declare namespace Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import NodeBuilder = Jymfony.Component.Config.Definition.Builder.NodeBuilder;

    /**
     * AbstractFactory is the base class for all classes inheriting from
     * AbstractAuthenticationListener.
     */
    export abstract class AbstractFactory extends implementationOf(SecurityFactoryInterface) {
        private _options: Record<string, any>;

        __construct(): void;
        constructor();

        create(container: ContainerBuilder, id: string, config: Record<string, any>, userProvider: string, defaultEntryPoint: string): [string, string, string];

        /**
         * Adds a configuration.
         */
        addConfiguration(node: NodeBuilder): void;

        /**
         * Adds an option.
         *
         * @param {string} name
         * @param {*} [defaultValue]
         *
         * @final
         */
        addOption(name: string, defaultValue?: any): void;

        /**
         * Subclasses must return the id of a service which implements the
         * AuthenticationProviderInterface.
         *
         * @param container
         * @param id The unique id of the firewall
         * @param config The options array for this listener
         * @param userProviderId The id of the user provider
         *
         * @returns never null, the id of the authentication provider
         */
        protected abstract _createAuthProvider(container: ContainerBuilder, id: string, config: Record<string, any>, userProviderId: string): string;

        /**
         * Creates an authentication listener.
         */
        protected abstract _createListener(container: ContainerBuilder, id: string, config: Record<string, any>, userProviderId: string): string;

        /**
         * Subclasses may create an entry point of their as they see fit. The
         * default implementation does not change the default entry point.
         */
        protected _createEntryPoint(container: ContainerBuilder, id: string, config: Record<string, any>, defaultEntryPointId: string): string;

        /**
         * Subclasses may disable remember-me features for the listener, by
         * always returning false from this method.8
         *
         * @returns Whether a possibly configured RememberMeServices should be set for this listener
         */
        protected _isRememberMeAware(config: Record<string, any>): boolean;
    }
}
