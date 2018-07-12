/** @global {Jymfony.Component.DependencyInjection.Loader.JsFileLoader} loader */
/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

container.register('command_1', Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.MyCommand)
    .setPublic(true)
    .addTag('console.command')
;

container.register('command_2', Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.MyCommand2)
    .setPublic(true)
    .addTag('console.command')
;
