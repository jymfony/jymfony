/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface, Jymfony.Component.HttpFoundation.Controller.ContainerControllerResolver)
    .addArgument(new Reference('service_container'))
    .addArgument(new Reference('logger'))
;

container.register(Jymfony.Component.HttpServer.HttpServer, Jymfony.Component.HttpServer.HttpServer)
    .setPublic(true)
    .setArguments([
        new Reference('event_dispatcher'),
        new Reference(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface),
    ])
;

container.register('kernel.exception_controller', Jymfony.Bundle.FrameworkBundle.Controller.ExceptionController)
    .setPublic(true)
    .addArgument('%kernel.debug%')
;

container.register(Jymfony.Component.HttpServer.EventListener.ExceptionListener, Jymfony.Component.HttpServer.EventListener.ExceptionListener)
    .addTag('kernel.event_subscriber')
    .addArgument('kernel.exception_controller:showAction')
    .addArgument(new Reference('logger'))
    .addArgument('%kernel.debug%')
;
