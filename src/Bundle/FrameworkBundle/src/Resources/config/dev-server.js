/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register(Jymfony.Component.DevServer.DevServer, Jymfony.Component.DevServer.DevServer)
    .addArgument('%kernel.project_dir%')
    .addArgument(new Reference('logger'))
;

container.register(Jymfony.Component.DevServer.Command.DevServerCommand, Jymfony.Component.DevServer.Command.DevServerCommand)
    .addTag('console.command')
    .addArgument(new Reference(Jymfony.Component.DevServer.DevServer))
;
