declare namespace Jymfony.Component.Logger.Formatter {
    interface ConsoleFormatterOptions {
        format: string;
        date_format: string;
        colors: boolean;
        multiline: boolean;
    }

    class ConsoleFormatter extends NormalizerFormatter {
        public static readonly SIMPLE_FORMAT = '%datetime% %start_tag%%level_name%%end_tag% <comment>[%channel%]</> %message%%context%%extra%\n';

        private _options: ConsoleFormatterOptions;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(options?: Partial<ConsoleFormatterOptions>): void;
        constructor(options?: Partial<ConsoleFormatterOptions>);

        /**
         * @inheritdoc
         */
        format(record: LogRecord): any;

        private _replacePlaceHolder(record: LogRecord): LogRecord;
    }
}
