/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('framework.cache_clear_command', 'Jymfony.Bundle.FrameworkBundle.Command.CacheClearCommand')
    .addMethodCall('setContainer', [ new Reference('service_container') ])
    .setPublic(true)
    .addTag('console.command')
;
