declare namespace Jymfony.Component.Logger.Formatter {
    export class FormatterInterface {
        /**
         * Formats a log record.
         */
        format(record: LogRecord): any;

        /**
         * Formats a set of log records.
         */
        formatBatch(records: LogRecord[]): any[];
    }
}
