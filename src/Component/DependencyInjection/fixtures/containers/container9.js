const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Reference = Jymfony.Component.DependencyInjection.Reference;

const container = new ContainerBuilder();
container.register('foo', 'Bar.Foo')
    .addTag('foo', {foo: 'foo'})
    .addTag('foo', {bar: 'bar', baz: 'baz'})
    .setFactory([ 'Bar.FooFactory', 'getInstance' ])
    .setArguments([
        'foo',
        new Reference('foo.baz'),
        {'%foo%': 'foo is %foo%', 'foobar': '%foo%'},
        true,
        new Reference('service_container'),
    ])
    .setProperties({foo: 'bar', moo: new Reference('foo.baz'), qux: {'%foo%': 'foo is %foo%', 'foobar': '%foo%'}})
    .addMethodCall('setBar', [ new Reference('bar') ])
    .addMethodCall('initialize')
    .addShutdownCall('shut', [ 'shut_arg' ])
    .setConfigurator('sc_configure')
    .setPublic(true)
;
container.register('foo.baz', '%baz.class%')
    .setFactory([ '%baz.class%', 'getInstance' ])
    .setConfigurator('%baz.class%.configureStatic1')
    .setPublic(true)
;
container.register('bar', 'Bar.FooClass')
    .setArguments([ 'foo', new Reference('foo.baz') ])
    .setConfigurator([ new Reference('foo.baz'), 'configure' ])
    .setPublic(true)
;
container.register('foo_bar', '%foo_class%')
    .setShared(false)
    .setPublic(true)
;
container.parameterBag.clear();
container.parameterBag.add({
    'baz.class': 'BazClass',
    'foo_class': 'Bar.FooClass',
    'foo': 'bar',
});

container.register('foo.mbaz.simple', '%baz.class%')
    .setModule('%baz.class%')
    .setPublic(true);
container.register('foo.mbaz.property', '%baz.class%')
    .setModule('%baz.class%', 'getInstance')
    .setPublic(true);

container.register('foo.mbaz.simple.inl', '%baz.class%')
    .setModule('%baz.class%')
    .setPublic(false);
container.register('foo.mbaz.property.inl', '%baz.class%')
    .setModule('%baz.class%', 'getInstance')
    .setPublic(false);
container.register('foo.mbaz', '%baz.class%')
    .setArguments([
        new Reference('foo.mbaz.simple.inl'),
        new Reference('foo.mbaz.property.inl')
    ])
    .setPublic(true);

module.exports = container;
