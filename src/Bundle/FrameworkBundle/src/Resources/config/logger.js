/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('jymfony.logger.processor.message_processor', Jymfony.Component.Logger.Processor.MessageProcessor);

container.register('jymfony.logger_prototype', Jymfony.Component.Kernel.Log.Logger)
    .setAbstract(true)
    .addArgument(undefined)
    .addArgument([])
    .addArgument([ new Reference('jymfony.logger.processor.message_processor') ])
    .addTag('kernel.event_subscriber')
;

container.register('jymfony.logger.formatter.json', Jymfony.Component.Logger.Formatter.JsonFormatter);
container.register('jymfony.logger.formatter.line', Jymfony.Component.Logger.Formatter.LineFormatter);
container.register('jymfony.logger.formatter.normalizer', Jymfony.Component.Logger.Formatter.NormalizerFormatter);
container.register('jymfony.logger.formatter.console', Jymfony.Component.Logger.Formatter.ConsoleFormatter);
container.register('jymfony.logger.formatter.mongodb', Jymfony.Component.Logger.Formatter.MongoDBFormatter);

container.register('jymfony.logger.handler_prototype.stream', Jymfony.Component.Logger.Handler.StreamHandler)
    .setArguments([
        null,
        Jymfony.Component.Logger.LogLevel.DEBUG,
        true,
        undefined,
    ])
    .addShutdownCall('close')
    .setAbstract(true)
;

container.register('jymfony.logger.handler_prototype.null', Jymfony.Component.Logger.Handler.NullHandler)
    .setArguments([
        Jymfony.Component.Logger.LogLevel.DEBUG,
        true,
    ])
    .setAbstract(true)
;

container.register('jymfony.logger.handler_prototype.console', Jymfony.Component.Logger.Handler.ConsoleHandler)
    .setArguments([
        undefined,
        true,
        undefined,
    ])
    .addShutdownCall('close')
    .setAbstract(true)
;

container.register('jymfony.logger.handler_prototype.mongodb', Jymfony.Component.Logger.Handler.MongoDBHandler)
    .setArguments([
        null,
        null,
        Jymfony.Component.Logger.LogLevel.DEBUG,
        true,
    ])
    .addShutdownCall('close')
    .setAbstract(true)
;

container.register('jymfony.logger.handler_prototype.slack', Jymfony.Component.Logger.Handler.SlackHandler)
    .setArguments([
        null,
        Jymfony.Component.Logger.LogLevel.DEBUG,
        true,
    ])
    .addShutdownCall('close')
    .setAbstract(true)
;

container.register('jymfony.logger.handler_prototype.slack_webhook', Jymfony.Component.Logger.Handler.SlackWebhookHandler)
    .setArguments([
        null,
        Jymfony.Component.Logger.LogLevel.DEBUG,
        true,
    ])
    .setAbstract(true)
;
