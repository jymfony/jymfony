declare namespace Jymfony.Component.Logger.Handler {
    import FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;

    export class SocketHandler extends AbstractProcessingHandler {
        private _connectionString: string;
        private _connection: Promise<void>;
        private _socket: any;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(connectionString: string, level?: number, bubble?: boolean): void;
        constructor(connectionString: string, level?: number, bubble?: boolean);

        /**
         * Closes the connection.
         */
        close(): void;

        /**
         * Connects the handler.
         */
        connect(): void;

        /**
         * Generates data to be sent via socket.
         */
        protected _generateDataStream(record: LogRecord): string;

        /**
         * @inheritdoc
         */
        protected _write(record: LogRecord): void;
    }
}
