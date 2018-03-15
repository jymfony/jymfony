/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('routing.resolver', Jymfony.Component.Config.Loader.LoaderResolver);

container.register(Jymfony.Component.Routing.Loader.JsFileLoader, Jymfony.Component.Routing.Loader.JsFileLoader)
    .addTag('routing.loader')
    .addArgument(new Reference('file_locator'))
;

container.register(Jymfony.Component.Routing.Loader.ServiceRouterLoader, Jymfony.Component.Routing.Loader.ServiceRouterLoader)
    .addTag('routing.loader')
    .addArgument(new Reference('service_container'))
;

container.register('routing.loader', Jymfony.Component.Config.Loader.DelegatingLoader)
    .addArgument(new Reference('routing.resolver'))
;

container.register('router.default', Jymfony.Component.Routing.Router)
    .addArgument(new Reference('routing.loader'))
    .addArgument('%router.resource%')
    .addArgument(new Reference('logger'))
    .addArgument({})
;

container.setAlias('router', new Alias('router.default', true));
