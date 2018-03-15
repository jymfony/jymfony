/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container
    .register(Jymfony.Component.EventDispatcher.EventDispatcher, Jymfony.Component.EventDispatcher.EventDispatcher)
    .setPublic(true);
container.setAlias(Jymfony.Component.EventDispatcher.EventDispatcherInterface, new Alias(Jymfony.Component.EventDispatcher.EventDispatcher, true));
container.setAlias('event_dispatcher', new Alias(Jymfony.Component.EventDispatcher.EventDispatcher, true));

container.register('kernel')
    .setPublic(true)
    .setSynthetic(true)
;

container.register('cache_warmer', Jymfony.Component.Kernel.CacheWarmer.CacheWarmerAggregate)
    .setPublic(true)
;

container.register('cache_clearer', Jymfony.Component.Kernel.CacheClearer.ChainCacheClearer)
    .setPublic(true)
;

container.register(Jymfony.Component.Kernel.Config.FileLocator, Jymfony.Component.Kernel.Config.FileLocator)
    .setPublic(true)
    .addArgument(new Reference('kernel'))
    .addArgument('%kernel.root_dir%/Resources')
    .addArgument([ '%kernel.root_dir%' ])
;
container.setAlias('file_locator', new Alias(Jymfony.Component.Kernel.Config.FileLocator, true));
