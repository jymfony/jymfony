/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('routing.resolver', Jymfony.Component.Config.Loader.LoaderResolver);

container.register(Jymfony.Component.Routing.Loader.JsFileLoader)
    .addTag('routing.loader')
    .addArgument(new Reference('file_locator'))
    .addArgument('%kernel.environment%')
;

container.register(Jymfony.Component.Routing.Loader.JsonFileLoader)
    .addTag('routing.loader')
    .addArgument(new Reference('file_locator'))
    .addArgument('%kernel.environment%')
;

container.register(Jymfony.Component.Routing.Loader.ServiceRouterLoader)
    .addTag('routing.loader')
    .addArgument(new Reference('service_container'))
    .addArgument('%kernel.environment%')
;

container.register(Jymfony.Component.Routing.Loader.YamlFileLoader)
    .addTag('routing.loader')
    .addArgument(new Reference('file_locator'))
    .addArgument('%kernel.environment%')
;

container.register('routing.loader', Jymfony.Component.Config.Loader.DelegatingLoader)
    .addArgument(new Reference('routing.resolver'))
;

container.register('router.default', Jymfony.Component.Routing.Router)
    .addArgument(new Reference('routing.loader'))
    .addArgument('%router.resource%')
    .addArgument({
        'cache_dir': '%kernel.cache_dir%',
        'debug': '%kernel.debug%',
        'matcher_cache_class': '%router.cache_class_prefix%UrlMatcher',
    })
;

container.setAlias('router', new Alias('router.default', true));

container.register(Jymfony.Bundle.FrameworkBundle.CacheWarmer.RouterCacheWarmer)
    .addTag('kernel.cache_warmer')
    .addArgument(new Reference('service_container'))
;
