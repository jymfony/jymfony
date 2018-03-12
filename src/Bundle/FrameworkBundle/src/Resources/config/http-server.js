/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface, Jymfony.Component.HttpFoundation.Controller.ContainerControllerResolver);
container.register(Jymfony.Component.HttpServer.HttpServer, Jymfony.Component.HttpServer.HttpServer)
    .setPublic(true)
    .setArguments([
        new Reference('event_dispatcher'),
        new Reference(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface),
    ])
;
