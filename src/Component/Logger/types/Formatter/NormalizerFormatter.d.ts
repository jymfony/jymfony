declare namespace Jymfony.Component.Logger.Formatter {
    import DateTime = Jymfony.Component.DateTime.DateTime;

    export class NormalizerFormatter extends implementationOf(FormatterInterface) {
        public static readonly SIMPLE_DATE = 'Y-m-d\\TH:i:sP';

        protected _dateFormat: string;

        /**
         * Constructor.
         *
         * @param {string} [dateFormat]
         */
        __construct(dateFormat?: string): void;
        constructor(dateFormat?: string);

        /**
         * @inheritdoc
         */
        format(record: LogRecord): any;

        /**
         * @inheritdoc
         */
        formatBatch(records: LogRecord[]): any[];

        /**
         * Normalizes a log record.
         */
        protected _normalize(record: LogRecord, depth?: number): any;

        /**
         * Normalizes an Error object.
         */
        protected _normalizeError(record: Error, depth: number): any;

        /**
         * Formats a datetime object.
         */
        protected _formatDate(record: DateTime): any;
    }
}
