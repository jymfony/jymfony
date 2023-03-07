/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const TaggedIteratorArgument = Jymfony.Component.DependencyInjection.Argument.TaggedIteratorArgument;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.setAlias(Jymfony.Contracts.DependencyInjection.ContainerInterface, 'service_container');

container.register('parameter_bag', Jymfony.Component.DependencyInjection.ParameterBag.ContainerBag)
    .addArgument(new Reference('service_container'))
;
container.setAlias(Jymfony.Component.DependencyInjection.ParameterBag.ContainerBagInterface, 'parameter_bag');

container
    .register(Jymfony.Component.EventDispatcher.EventDispatcher)
    .setPublic(true);
container.setAlias(Jymfony.Contracts.EventDispatcher.EventDispatcherInterface, new Alias(Jymfony.Component.EventDispatcher.EventDispatcher, true));
container.setAlias('event_dispatcher', new Alias(Jymfony.Component.EventDispatcher.EventDispatcher, true));

container.register('kernel')
    .setPublic(true)
    .setSynthetic(true)
;

container.register('cache_warmer', Jymfony.Component.Kernel.CacheWarmer.CacheWarmerAggregate)
    .addArgument(new TaggedIteratorArgument('kernel.cache_warmer'))
    .setPublic(true)
;

container.register('cache_clearer', Jymfony.Component.Kernel.CacheClearer.ChainCacheClearer)
    .addArgument(new TaggedIteratorArgument('kernel.cache_clearer'))
    .setPublic(true)
;

container.register(Jymfony.Component.Kernel.Config.FileLocator)
    .setPublic(true)
    .addArgument(new Reference('kernel'))
    .addArgument('%kernel.root_dir%/Resources')
    .addArgument([ '%kernel.root_dir%' ])
;
container.setAlias('file_locator', new Alias(Jymfony.Component.Kernel.Config.FileLocator, true));
