declare namespace Jymfony.Component.Logger.Formatter {
    import DateTime = Jymfony.Component.DateTime.DateTime;

    export class MongoDBFormatter extends implementationOf(FormatterInterface) {
        /**
         * Constructor.
         *
         * @param [maxNestingLevel = 3] means infinite nesting, the record itself is level 1, record.context is 2
         * @param [exceptionTraceAsString = true] set to false to log exception traces as a sub documents instead of strings
         */
        __construct(maxNestingLevel?: number, exceptionTraceAsString?: boolean): void;
        constructor(maxNestingLevel?: number, exceptionTraceAsString?: boolean);

        /**
         * @inheritdoc
         */
        format(record: LogRecord): any;

        /**
         * @inheritdoc
         */
        formatBatch(records: LogRecord[]): any[];

        /**
         * Treat and format the given record as an array.
         *
         * @returns Object except when max nesting level is reached then a string "[...]"
         *
         * @protected
         */
        protected _formatArray(record: LogRecord, nestingLevel?: number): Record<string, any> | string;

        /**
         * Treat and format the given record as an object.
         *
         * @protected
         */
        protected _formatObject(record: LogRecord, nestingLevel: number): any;

        /**
         * Treat and format the given record as an error.
         */
        protected _formatError(record: Error, nestingLevel: number): any;

        /**
         * Treat and format the given record as a date.
         */
        protected _formatDate(record: DateTime): Date;
    }
}
