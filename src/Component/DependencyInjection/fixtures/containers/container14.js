const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Reference = Jymfony.Component.DependencyInjection.Reference;

const container = new ContainerBuilder();

container.register('baz', 'BazClass');

container.register('factory', 'FooBarClass')
    .setFactory([ new Reference('baz'), 'getClass' ])
    .setPublic(true);

container.register('factory_with_static_call', 'FooBarClass')
    .setFactory('FooBacFactory#createFooBar')
    .setPublic(true);

container.register('invokable_factory', 'FooBarClass')
    .setFactory([ new Reference('factory'), '__invoke' ])
    .setPublic(true);

module.exports = container;
