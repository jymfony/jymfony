/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.setParameter('security.role_hierarchy.roles', {});
container.setParameter('security.authentication.trust_resolver.anonymous_class', 'Jymfony.Component.Security.Authentication.Token.AnonymousToken');
container.setParameter('security.authentication.trust_resolver.rememberme_class', 'Jymfony.Component.Security.Authentication.Token.RememberMeToken');

container.setAlias(Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface, new Alias(Jymfony.Component.Security.Authorization.AccessDecisionManager));
container.register(Jymfony.Component.Security.Authorization.AccessDecisionManager)
    .addArgument([]) // Voters
;

container.setAlias(Jymfony.Component.Security.Authorization.AccessMapInterface, new Alias(Jymfony.Component.Security.Authorization.AccessMap));
container.register(Jymfony.Component.Security.Authorization.AccessMap);

container.register('security.authorization_checker', Jymfony.Component.Security.Authorization.AuthorizationChecker)
    .addArgument(new Reference(Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface))
;
container.setAlias(Jymfony.Component.Security.Authorization.AuthorizationCheckerInterface, new Alias('security.authorization_checker', true));

container.setAlias(Jymfony.Component.Security.Authentication.AuthenticationManagerInterface, new Alias(Jymfony.Component.Security.Authentication.AuthenticationProviderManager));
container.register(Jymfony.Component.Security.Authentication.AuthenticationProviderManager)
    .addArgument([]) // Providers
    .addArgument('%security.authentication.manager.erase_credentials%')
    .addMethodCall('setEventDispatcher', [ new Reference('event_dispatcher') ])
;

container.register(Jymfony.Component.Security.Authentication.AuthenticationTrustResolver)
    .addArgument('%security.authentication.trust_resolver.anonymous_class%')
    .addArgument('%security.authentication.trust_resolver.rememberme_class%')
;
container.setAlias(Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface, new Alias(Jymfony.Component.Security.Authentication.AuthenticationTrustResolver));

container.register('security.firewall.map', Jymfony.Component.Security.Firewall.FirewallMap);
container.setAlias(Jymfony.Component.Security.Firewall.FirewallMapInterface, new Alias('security.firewall.map'));

container.register(Jymfony.Component.Security.Http.HttpUtils)
    .addArgument(new Reference('router'))
;

container.register(Jymfony.Component.Security.Authentication.Token.Storage.TokenStorage);
container.setAlias(Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface, new Alias(Jymfony.Component.Security.Authentication.Token.Storage.TokenStorage));

container.register('security.user_checker', Jymfony.Component.Security.User.UserChecker);

container.setAlias(Jymfony.Component.Security.Role.RoleHierarchyInterface, Jymfony.Component.Security.Role.RoleHierarchy);
container.register(Jymfony.Component.Security.Role.RoleHierarchy)
    .addArgument('%security.role_hierarchy.roles%')
;


container.register(Jymfony.Component.Security.Authorization.Voter.RoleVoter)
    .addTag('security.voter', { priority: 245 })
;

container.register(Jymfony.Component.Security.Authorization.Voter.AuthenticatedVoter)
    .addArgument(new Reference(Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface))
    .addTag('security.voter', { priority: 250 })
;

container.register(Jymfony.Component.Security.Authorization.Voter.RoleHierarchyVoter)
    .addArgument(new Reference(Jymfony.Component.Security.Role.RoleHierarchyInterface))
    .addTag('security.voter', { priority: 245 })
;

container.setAlias(Jymfony.Component.Security.Encoder.EncoderFactoryInterface, new Alias(Jymfony.Component.Security.Encoder.EncoderFactory));
container.register(Jymfony.Component.Security.Encoder.EncoderFactory)
    .addArgument({})
;
