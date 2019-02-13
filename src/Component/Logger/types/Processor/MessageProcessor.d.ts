declare namespace Jymfony.Component.Logger.Processor {
    import LogRecord = Jymfony.Component.Logger.LogRecord;

    export class MessageProcessor {
        /**
         * Handle placeholders in message and replaces with context properties.
         */
        __invoke(record: LogRecord): LogRecord;
    }
}
