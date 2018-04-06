const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Reference = Jymfony.Component.DependencyInjection.Reference;

process.env['LANG'] = 'C';

const container = new ContainerBuilder();
container.register('foo', 'Bar.Foo')
    .setArguments([
        '%env(BAR)%',
        {'LANG': '%env(LANG)% is %env(FOO)%', 'foobar': '%foo%'},
        true,
        new Reference('service_container'),
    ])
    .setPublic(true)
;

container.parameterBag.clear();
container.parameterBag.add({
    'foo': 'bar',
    'env(FOO)': 'bar',
});

module.exports = container;
