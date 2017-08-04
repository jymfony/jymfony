/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

container.register('event_dispatcher', 'Jymfony.Component.EventDispatcher.EventDispatcher')
    .setPublic(true)
;

container.register('kernel')
    .setPublic(true)
    .setSynthetic(true)
;

container.register('cache_warmer', 'Jymfony.Component.Kernel.CacheWarmer.CacheWarmerAggregate')
    .setPublic(true)
;
