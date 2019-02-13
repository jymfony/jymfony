declare namespace Jymfony.Component.Logger.Handler {
    import FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;

    export class MongoDBHandler extends AbstractProcessingHandler {
        private _client: any;
        private _collection: string;
        private _connection: Promise<void>;

        /**
         * Constructor.
         *
         * @param client The mongodb client.
         * @param collection The target collection name.
         * @param [level = LogLevel.DEBUG] The minimum logging level at which this handler will be triggered.
         * @param [bubble = true] Whether the messages that are handled can bubble up the stack or not.
         */
        // @ts-ignore
        __construct(client: any, collection: string, level?: number, bubble?: boolean): void;
        constructor(client: any, collection: string, level?: number, bubble?: boolean);

        /**
         * @inheritdoc
         */
        getDefaultFormatter(): FormatterInterface;

        close(): void;

        /**
         * @inheritdoc
         */
        protected _write(record: LogRecord): void;
    }
}
