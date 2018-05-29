/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const Container = Jymfony.Component.DependencyInjection.Container;

container.register('test.service_container', Jymfony.Bundle.FrameworkBundle.Test.TestContainer)
    .setPublic(true)
    .addArgument(new Reference('parameter_bag', Container.NULL_ON_INVALID_REFERENCE))
    .addArgument(new Reference('service_container'))
    .addArgument(
        (new Definition(Jymfony.Component.DependencyInjection.ServiceLocator))
            .addArgument({})
    )
;
