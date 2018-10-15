/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register(Jymfony.Component.HttpServer.EventListener.SessionListener)
    .addTag('kernel.event_subscriber')
    .addArgument(new Reference('service_container'))
    .addArgument() // Storage Id
;

container.setDefinition('session.storage.filesystem', Jymfony.Component.HttpFoundation.Session.Storage.FilesystemSessionStorage)
    .setPublic(true)
    .setShared(false)
    .addArgument() // Options
;
