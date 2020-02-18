/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface, Jymfony.Component.HttpFoundation.Controller.ContainerControllerResolver)
    .addArgument(new Reference('service_container'))
    .addArgument(new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE))
;

container.register('argument_metadata_factory', Jymfony.Component.HttpServer.Controller.Metadata.ArgumentMetadataFactory);

container.register('argument_resolver', Jymfony.Component.HttpServer.Controller.ArgumentResolver)
    .addArgument(new Reference('argument_metadata_factory'))
    .addArgument([])
;

container.register('argument_resolver.request_attribute', Jymfony.Component.HttpServer.Controller.ArgumentResolvers.RequestAttributeValueResolver)
    .addTag('controller.argument_value_resolver', { priority: 100 })
;
container.register('argument_resolver.request', Jymfony.Component.HttpServer.Controller.ArgumentResolvers.RequestValueResolver)
    .addTag('controller.argument_value_resolver', { priority: 50 })
;
container.register('argument_resolver.session', Jymfony.Component.HttpServer.Controller.ArgumentResolvers.SessionValueResolver)
    .addTag('controller.argument_value_resolver', { priority: 50 })
;
container.register('argument_resolver.service', Jymfony.Component.HttpServer.Controller.ArgumentResolvers.ServiceValueResolver)
    .addArgument()
    .addTag('controller.argument_value_resolver', { priority: -50 })
;
container.register('argument_resolver.default', Jymfony.Component.HttpServer.Controller.ArgumentResolvers.DefaultValueResolver)
    .addTag('controller.argument_value_resolver', { priority: -100 })
;
container.register('argument_resolver.variadic', Jymfony.Component.HttpServer.Controller.ArgumentResolvers.VariadicValueResolver)
    .addTag('controller.argument_value_resolver', { priority: -150 })
;

container.register(Jymfony.Component.HttpServer.RequestHandler)
    .setAbstract(true)
    .addArgument(new Reference('event_dispatcher'))
    .addArgument(new Reference(Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface))
    .addArgument(new Reference('argument_resolver'))
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
;

container.setDefinition(Jymfony.Component.HttpServer.HttpServer, new ChildDefinition(Jymfony.Component.HttpServer.RequestHandler))
    .setClass(Jymfony.Component.HttpServer.HttpServer)
    .setPublic(true)
;

container.register('kernel.exception_controller', Jymfony.Bundle.FrameworkBundle.Controller.ExceptionController)
    .setPublic(true)
    .addArgument('%kernel.debug%')
;

container.register(Jymfony.Component.HttpServer.EventListener.UnhandledRejectionListener)
    .addTag('kernel.event_subscriber')
    .addArgument(new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE))
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

container.setDefinition(Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler, new ChildDefinition(Jymfony.Component.HttpServer.RequestHandler))
    .setClass(Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler)
    .setPublic(true)
;
