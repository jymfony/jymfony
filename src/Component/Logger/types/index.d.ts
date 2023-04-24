/// <reference path="DependencyInjection/Compiler/LoggerAddProcessorsPass.d.ts" />
/// <reference path="DependencyInjection/Compiler/LoggerChannelPass.d.ts" />
/// <reference path="Formatter/ConsoleFormatter.d.ts" />
/// <reference path="Formatter/FormatterInterface.d.ts" />
/// <reference path="Formatter/JsonFormatter.d.ts" />
/// <reference path="Formatter/LineFormatter.d.ts" />
/// <reference path="Formatter/MongoDBFormatter.d.ts" />
/// <reference path="Formatter/NormalizerFormatter.d.ts" />
/// <reference path="Handler/Slack/SlackRecord.d.ts" />
/// <reference path="Handler/AbstractHandler.d.ts" />
/// <reference path="Handler/AbstractProcessingHandler.d.ts" />
/// <reference path="Handler/ConsoleHandler.d.ts" />
/// <reference path="Handler/FormattableHandlerInterface.d.ts" />
/// <reference path="Handler/FormattableHandlerTrait.d.ts" />
/// <reference path="Handler/HandlerInterface.d.ts" />
/// <reference path="Handler/MongoDBHandler.d.ts" />
/// <reference path="Handler/NoopHandler.d.ts" />
/// <reference path="Handler/NullHandler.d.ts" />
/// <reference path="Handler/ProcessableHandlerInterface.d.ts" />
/// <reference path="Handler/ProcessableHandlerTrait.d.ts" />
/// <reference path="Handler/SlackHandler.d.ts" />
/// <reference path="Handler/SlackOptions.d.ts" />
/// <reference path="Handler/SlackWebhookHandler.d.ts" />
/// <reference path="Handler/SocketHandler.d.ts" />
/// <reference path="Handler/StreamHandler.d.ts" />
/// <reference path="Handler/TestHandler.d.ts" />
/// <reference path="Processor/MessageProcessor.d.ts" />
/// <reference path="AbstractLogger.d.ts" />
/// <reference path="Logger.d.ts" />

declare namespace Jymfony.Component.Logger {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

    export interface LogRecordLevel {
        level: number;
    }

    export interface LogRecord extends LogRecordLevel {
        message: string,
        context: any,
        level_name: string,
        channel: string,
        datetime: DateTimeInterface,
        extra: any,
    }
}
