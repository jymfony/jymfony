/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('debug.stopwatch', Jymfony.Component.Stopwatch.Stopwatch);
container.setAlias(Jymfony.Component.Stopwatch.Stopwatch, new Alias('debug.stopwatch', false));
container.setAlias(Jymfony.Contracts.Stopwatch.StopwatchInterface, new Alias('debug.stopwatch', false));

container.register('debug.event_dispatcher', Jymfony.Component.EventDispatcher.Debug.TraceableEventDispatcher)
    .setDecoratedService('event_dispatcher')
    .addTag('jymfony.logger', { channel: 'event' })
    .addArgument(new Reference('debug.event_dispatcher.inner'))
    .addArgument(new Reference('debug.stopwatch'))
    .addArgument(new Reference('logger', Container.NULL_ON_INVALID_REFERENCE))
;
