declare namespace Jymfony.Bundle.SecurityBundle.DependencyInjection {
    import Extension = Jymfony.Component.DependencyInjection.Extension.Extension;
    import UserProviderFactoryInterface = Jymfony.Bundle.SecurityBundle.DependencyInjection.UserProvider.UserProviderFactoryInterface;
    import SecurityFactoryInterface = Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.SecurityFactoryInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import AuthenticationProviderInterface = Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface;
    import ListenerInterface = Jymfony.Component.Security.Firewall.ListenerInterface;
    import Definition = Jymfony.Component.DependencyInjection.Definition;

    export class SecurityExtension extends Extension {
        private _userProviderFactories: UserProviderFactoryInterface[];
        private _factories: Record<string, SecurityFactoryInterface[]>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Load a configuration.
         */
        load(configs: any[], container: ContainerBuilder): void;

        /**
         * Adds a security listener factory.
         */
        addSecurityListenerFactory(factory: SecurityFactoryInterface): void;

        /**
         * Adds a user provider factory.
         */
        addUserProviderFactory(factory: UserProviderFactoryInterface): void;

        /**
         * Creates the firewalls.
         */
        private _createFirewalls(config: any, container: ContainerBuilder): void;

        /**
         * Create and register user provider services.
         */
        private _createUserProviders(config: any, container: ContainerBuilder): Record<string, string>;

        /**
         * Parses a provider and returns the id for the related user provider service
         */
        private _createUserDaoProvider(name: string, provider: Record<string, any>, container: ContainerBuilder): string;

        /**
         * Generate a provider service id.
         */
        private _getUserProviderId(name: string): string;

        /**
         * Creates firewall services from configuration.
         */
        private _createFirewall(container: ContainerBuilder, name: string, firewall: any, authenticationProviders: Set<AuthenticationProviderInterface>, providerIds: Record<string, string>, configId: string): void;

        private _createAuthenticationListeners(container: ContainerBuilder, id: string, firewall: any, authenticationProviders: Set<AuthenticationProviderInterface>, defaultProvider: string, providerIds: Record<string, string>, defaultEntryPoint: string): [ListenerInterface[], string];

        /**
         * Creates a request matcher for the given firewall configuration.
         */
        private _createRequestMatcher(path?: string, host?: string, methods?: string | string[], ips?: string | string[], attributes?: Record<string, any>, schemes?: string | string[]): Definition;

        /**
         * Create authorization services and access map.
         */
        private _createAuthorization(config: Record<string, any>, container: ContainerBuilder): void;

        /**
         * Creates the role hierarchy parameters.
         */
        private _createRoleHierarchy(config: any, container: ContainerBuilder): void;
    }
}
