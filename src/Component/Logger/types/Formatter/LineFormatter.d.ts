declare namespace Jymfony.Component.Logger.Formatter {
    export class LineFormatter extends NormalizerFormatter {
        public static readonly SIMPLE_FORMAT = '[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n';
        protected _format: string;
        protected _allowInlineLineBreaks: boolean;
        protected _includeStacktraces: boolean;

        /**
         * Constructor.
         */
        __construct(format?: string, dateFormat?: string, allowInlineLineBreaks?: boolean): void;
        constructor(format?: string, dateFormat?: string, allowInlineLineBreaks?: boolean);

        /**
         * Sets whether to include stack trace or not while
         * dumping an Error object
         */
        public /* writeonly */ includeStacktrace: boolean;

        /**
         * @inheritdoc
         */
        format(record: LogRecord): any;

        stringify(value: any): string;

        /**
         * @inheritdoc
         */
        protected _normalizeError(record: Error): any;

        private _convertToString(data: any): string;

        /**
         * Replaces \r or \n characters.
         */
        protected _replaceNewlines(str: string): string;
    }
}
