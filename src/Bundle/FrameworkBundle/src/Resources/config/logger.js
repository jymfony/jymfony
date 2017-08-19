/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;

container.register('jymfony.logger_prototype', 'Jymfony.Component.Logger.Logger')
    .setAbstract(true)
    .addArgument(undefined)
;

const definition = (new ChildDefinition('jymfony.logger_prototype'))
    .setPublic(false)
    .replaceArgument(0, 'app');

container.setDefinition('jymfony.logger', definition);
container.setAlias('logger', (new Alias('jymfony.logger').setPublic(true)));
