/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

container.register('jymfony.logger_prototype', Jymfony.Component.Logger.Logger)
    .setAbstract(true)
    .addArgument(undefined)
    .addArgument([])
;

container.register('jymfony.logger.handler_prototype.stream', Jymfony.Component.Logger.Handler.StreamHandler)
    .setArguments([
        null,
        Jymfony.Component.Logger.LogLevel.DEBUG,
        true,
        undefined,
    ])
    .setAbstract(true)
;

container.register('jymfony.logger.handler_prototype.console', Jymfony.Component.Logger.Handler.ConsoleHandler)
    .setArguments([
        undefined,
        true,
        undefined,
    ])
    .setAbstract(true)
;
