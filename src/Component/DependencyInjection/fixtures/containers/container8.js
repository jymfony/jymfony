const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;

const container = new ContainerBuilder(new ParameterBag({
    'FOO': '%baz%',
    'baz': 'bar',
    'bar': 'foo is %%foo bar',
    'escape': '@escapeme',
    'values': [ true, false, null, 0, 1000.3, 'true', 'false', 'null' ],
}));

module.exports = container;
