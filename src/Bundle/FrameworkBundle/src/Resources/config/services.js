/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

container.register('event_dispatcher', 'Jymfony.Component.EventDispatcher.EventDispatcher');

container.register('kernel')
    .setPublic(true)
    .setSynthetic(true);
