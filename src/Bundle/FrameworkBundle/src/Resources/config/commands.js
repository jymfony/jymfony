/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('framework.cache_clearer_command', 'Jymfony.Bundle.FrameworkBundle.Command.CacheClearerCommand')
    .addMethodCall('setContainer', [ new Reference('service_container') ])
    .setPublic(true)
    .addTag('console.command')
;
