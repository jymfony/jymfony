/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;
const Container = Jymfony.Component.DependencyInjection.Container;

container.register('security.context_listener', Jymfony.Component.Security.Firewall.ContextListener)
    .setAbstract(true)
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface))
    .addArgument() // User providers
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface))
    .addArgument(new Reference('jymfony.logger', Container.NULL_ON_INVALID_REFERENCE))
    .addTag('jymfony.logger', { channel: 'security' })
    .addTag('kernel.event_subscriber')
;

container.register('security.firewall', Jymfony.Component.Security.Firewall.Firewall)
    .addArgument(new Reference('security.firewall.map'))
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface))
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface))
    .addArgument(new Reference('jymfony.logger', Container.NULL_ON_INVALID_REFERENCE))
    .addTag('jymfony.logger', { channel: 'security' })
    .addTag('kernel.event_subscriber')
;

container.register('security.logout_listener', Jymfony.Component.Security.Logout.LogoutListener)
    .setAbstract(true)
    .addArgument(new Reference(Jymfony.Component.Security.Http.HttpUtils))
    .addArgument() // Logout path
    .addArgument() // Target path
;

container.register(Jymfony.Component.Security.Firewall.AnonymousAuthenticationListener)
    .setAbstract(true)
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface))
    .addArgument() // Secret
    .addArgument(new Reference('logger', Container.NULL_ON_INVALID_REFERENCE))
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.AuthenticationManagerInterface))
;

container.register(Jymfony.Component.Security.Authentication.Provider.AnonymousAuthenticationProvider)
    .setAbstract(true)
    .addArgument() // Secret
;

container.register('security.access_listener', Jymfony.Component.Security.Firewall.AccessListener)
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface))
    .addArgument(new Reference(Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface))
    .addArgument(new Reference(Jymfony.Component.Security.Authorization.AccessMapInterface))
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.AuthenticationManagerInterface))
;

// Logout handlers
container.register(Jymfony.Component.Security.Logout.SessionLogoutHandler);
