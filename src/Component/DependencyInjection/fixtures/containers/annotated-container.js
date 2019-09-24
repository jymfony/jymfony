const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;

const container = new ContainerBuilder(new ParameterBag({
    'FOO': '%baz%',
    'baz': 'bar',
    'bar': 'foo is %%foo bar',
    'escape': '@escapeme',
    'values': [ true, false, null, 0, 1000.3, 'true', 'false', 'null' ],
    'kernel.debug': true,
}));

container.register(Jymfony.Component.DependencyInjection.Fixtures.AnnotatedBar)
    .setPublic(true);

module.exports = container;
