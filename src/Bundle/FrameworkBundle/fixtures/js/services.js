/** @global loader */
/** @var {Jymfony.Component.DependencyInjection.Loader.JsFileLoader} loader */

/** @global container */
/** @var {Jymfony.Component.DependencyInjection.Containercontainer} container */
container.setParameter('console.command.ids', [ 'command_1', 'command_2' ]);
container.register('command_1', 'MyCommand')
    .setPublic(true)
    .setFile(`${loader.currentDir}/../MyCommand.js`)
;
container.register('command_2', 'MyCommand2')
    .setPublic(true)
    .setFile(`${loader.currentDir}/../MyCommand2.js`)
;
