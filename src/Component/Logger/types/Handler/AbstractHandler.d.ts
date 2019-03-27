declare namespace Jymfony.Component.Logger.Handler {
    import FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;

    export class AbstractHandler extends implementationOf(HandlerInterface) {
        private _level: number;
        private _bubble: boolean;

        /**
         * Constructor.
         *
         * @param [level = LogLevel.DEBUG] The minimum logging level at which this handler will be triggered
         * @param [bubble = true] Whether the messages that are handled can bubble up the stack or not
         */
        __construct(level?: number, bubble?: boolean): void;
        constructor(level?: number, bubble?: boolean);

        /**
         * @inheritdoc
         */
        close(): void;

        /**
         * @inheritdoc
         */
        handleBatch(records: LogRecord[]): void;

        /**
         * @inheritdoc
         */
        isHandling(record: LogRecord): boolean;

        /**
         * Gets/sets the minimum logger level.
         */
        public level: number;

        /**
         * Gets/sets the bubble flag.
         */
        public bubble: boolean;

        /**
         * Gets the default formatter.
         */
        getDefaultFormatter(): FormatterInterface;
    }
}
