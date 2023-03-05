/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.setAlias('console.application', new Alias(Jymfony.Bundle.FrameworkBundle.Console.Application, true));
container.setAlias(Jymfony.Component.Console.Application, new Alias(Jymfony.Bundle.FrameworkBundle.Console.Application, true));
container.register(Jymfony.Bundle.FrameworkBundle.Console.Application)
    .setPublic(true)
    .addArgument(new Reference('kernel'))
    .addProperty('dispatcher', new Reference('event_dispatcher'))
;

container.register('framework.cache_clear_command', Jymfony.Bundle.FrameworkBundle.Command.CacheClearCommand)
    .addMethodCall('setContainer', [ new Reference('service_container') ])
    .setAutoconfigured(true)
    .setPublic(true)
;

container.register('framework.cache_warmup_command', Jymfony.Bundle.FrameworkBundle.Command.CacheWarmupCommand)
    .addArgument(new Reference('cache_warmer'))
    .setAutoconfigured(true)
    .setPublic(true)
;
