declare namespace Jymfony.Component.Logger.Formatter {
    export class JsonFormatter extends NormalizerFormatter {
        /**
         * @inheritdoc
         */
        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        format(record: LogRecord): any;

        /**
         * @inheritdoc
         */
        protected _normalize(record: LogRecord, depth?: number): any;
    }
}
