/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register(Jymfony.Component.HttpServer.EventListener.SessionListener)
    .addTag('kernel.event_subscriber')
    .addArgument(new Reference('service_container'))
    .addArgument(undefined) // Storage Id
    .addArgument(0) // Cookie lifetime
    .addArgument('/') // Cookie path
    .addArgument(undefined) // Cookie domain
    .addArgument(true) // Cookie secure
    .addArgument(true) // Cookie http only
;

container.register('session.storage.filesystem', Jymfony.Component.HttpFoundation.Session.Storage.FilesystemSessionStorage)
    .setPublic(true)
    .setShared(false)
    .addArgument(undefined) // Options
;
