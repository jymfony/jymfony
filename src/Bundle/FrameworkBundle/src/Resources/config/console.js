/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.setAlias('console.application', new Alias(Jymfony.Bundle.FrameworkBundle.Console.Application, true));
container.register(Jymfony.Bundle.FrameworkBundle.Console.Application)
    .setPublic(true)
    .addArgument(new Reference('kernel'))
    .addProperty('dispatcher', new Reference('event_dispatcher'))
;

container.register('framework.cache_clear_command', Jymfony.Bundle.FrameworkBundle.Command.CacheClearCommand)
    .addMethodCall('setContainer', [ new Reference('service_container') ])
    .setPublic(true)
    .addTag('console.command')
;
