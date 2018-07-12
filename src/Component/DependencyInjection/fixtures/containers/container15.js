const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Reference = Jymfony.Component.DependencyInjection.Reference;

const container = new ContainerBuilder();
container.register('foo')
    .addTag('foo', {foo: 'foo'})
    .addTag('foo', {bar: 'bar', baz: 'baz'})
    .setModule('module1')
    .addMethodCall('setBar', [ new Reference('bar') ])
    .addMethodCall('initialize')
    .setProperties({foo: 'bar', qux: {'%foo%': 'foo is %foo%', 'foobar': '%foo%'}})
    .setConfigurator('sc_configure')
    .setPublic(true)
;
container.register('foo.baz', '%baz.class%')
    .setModule('%baz.class%', 'prop')
    .setArguments([
        'foo',
        new Reference('foo'),
        {'%foo%': 'foo is %foo%', 'foobar': '%foo%'},
        true,
        new Reference('service_container'),
    ])
    .setConfigurator('%baz.class%.configureStatic1')
    .setPublic(true)
;
container.register('bar', 'Bar.FooClass')
    .setPublic(true)
;
container.parameterBag.clear();
container.parameterBag.add({
    'baz.class': 'BazClass',
    'foo_class': 'Bar.FooClass',
    'foo': 'bar',
});

module.exports = container;
