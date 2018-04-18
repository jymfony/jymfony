/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('jymfony.logger.processor.message_processor', Jymfony.Component.Logger.Processor.MessageProcessor);

container.register('jymfony.logger_prototype', Jymfony.Component.Logger.Logger)
    .setAbstract(true)
    .addArgument(undefined)
    .addArgument([])
    .addArgument([ new Reference('jymfony.logger.processor.message_processor') ])
;

container.register('jymfony.logger.formatter.json', Jymfony.Component.Logger.Formatter.JsonFormatter);
container.register('jymfony.logger.formatter.line', Jymfony.Component.Logger.Formatter.LineFormatter);
container.register('jymfony.logger.formatter.normalizer', Jymfony.Component.Logger.Formatter.NormalizerFormatter);
container.register('jymfony.logger.formatter.console', Jymfony.Component.Logger.Formatter.ConsoleFormatter);

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
