/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface, Jymfony.Component.HttpFoundation.Controller.ContainerControllerResolver)
    .addArgument(new Reference('service_container'))
    .addArgument(new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE))
;

container.register(Jymfony.Component.HttpServer.HttpServer)
    .setPublic(true)
    .addArgument(new Reference('event_dispatcher'))
    .addArgument(new Reference(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface))
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
;

container.register('kernel.exception_controller', Jymfony.Bundle.FrameworkBundle.Controller.ExceptionController)
    .setPublic(true)
    .addArgument('%kernel.debug%')
;

container.register(Jymfony.Component.HttpServer.EventListener.ExceptionListener)
    .addTag('kernel.event_subscriber')
    .addArgument('kernel.exception_controller:showAction')
    .addArgument(new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE))
    .addArgument('%kernel.debug%')
;

container.register(Jymfony.Component.HttpServer.EventListener.RouterListener)
    .addTag('kernel.event_subscriber')
    .addTag('jymfony.logger', { channel: 'request' })
    .addArgument(new Reference('router'))
    .addArgument(new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE))
    .addArgument('%kernel.project_dir%')
    .addArgument('%kernel.debug%')
;

container.register(Jymfony.Component.HttpServer.Command.HttpServerRunCommand)
    .addTag('console.command')
    .addArgument(new Reference(Jymfony.Component.HttpServer.HttpServer))
;

container.register(Jymfony.Component.HttpServer.EventListener.WebsocketListener)
    .addTag('kernel.event_subscriber')
;

container.register(Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler)
    .setPublic(true)
    .addArgument(new Reference('event_dispatcher'))
    .addArgument(new Reference(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface))
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
;
