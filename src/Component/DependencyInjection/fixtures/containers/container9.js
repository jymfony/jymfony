const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const Parameter = Jymfony.Component.DependencyInjection.Parameter;
const Reference = Jymfony.Component.DependencyInjection.Reference;

let container = new ContainerBuilder();
container.register('foo', 'Bar.Foo')
    .addTag('foo', {foo: 'foo'})
    .addTag('foo', {bar: 'bar', baz: 'baz'})
    .setFactory(['Bar.FooFactory', 'getInstance'])
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
    .setConfigurator('sc_configure')
    .setPublic(true)
;
container.register('foo.baz', '%baz.class%')
    .setFactory(['%baz.class%', 'getInstance'])
    .setConfigurator('%baz.class%.configureStatic1')
    .setPublic(true)
;
container.register('bar', 'Bar.FooClass')
    .setArguments(['foo', new Reference('foo.baz')])
    .setConfigurator([new Reference('foo.baz'), 'configure'])
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

module.exports = container;
