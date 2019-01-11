/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.setDefinition('cache.app', new ChildDefinition('cache.adapter.filesystem'))
    .setPublic(true)
    .addTag('cache.pool', { clearer: 'cache.app_clearer', reset: 'reset' })
;

container.register('cache.adapter.system', Jymfony.Component.Cache.CacheItemPoolInterface)
    .setAbstract(true)
    .addTag('cache.pool', { clearer: 'cache.system_clearer' })
    .addTag('jymfony.logger', { channel: 'cache' })
    .addArgument(undefined)
    .addArgument(0)
    .addArgument(undefined)
    .addArgument('%kernel.cache_dir%/pools')
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
;

container.register('cache.adapter.array', Jymfony.Component.Cache.Adapter.ArrayAdapter)
    .setAbstract(true)
    .addTag('cache.pool', { clearer: 'cache.default_clearer' })
    .addTag('jymfony.logger', { channel: 'cache' })
    .addArgument(0)
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
;

container.register('cache.adapter.filesystem', Jymfony.Component.Cache.Adapter.FilesystemAdapter)
    .setAbstract(true)
    .addTag('cache.pool', { clearer: 'cache.default_clearer' })
    .addTag('jymfony.logger', { channel: 'cache' })
    .addArgument(undefined) // Namespace
    .addArgument(0)
    .addArgument('%kernel.cache_dir%/pools')
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
;

container.register('cache.adapter.redis', Jymfony.Component.Cache.Adapter.RedisAdapter)
    .setAbstract(true)
    .addTag('cache.pool', { provider: 'cache.default_redis_provider', clearer: 'cache.default_clearer' })
    .addTag('jymfony.logger', { channel: 'cache' })
    .addArgument(undefined) // Client
    .addArgument(undefined) // Namespace
    .addArgument(0)
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
    .addShutdownCall('close')
;

container.register('cache.adapter.null', Jymfony.Component.Cache.Adapter.NullAdapter)
    .setAbstract(true)
    .addTag('cache.pool', { clearer: 'cache.default_clearer' })
    .addTag('jymfony.logger', { channel: 'cache' })
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
;
