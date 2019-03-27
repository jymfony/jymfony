declare namespace Jymfony.Component.Console.Output {
    import OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;

    export class StreamOutput extends Output {
        /**
         * The underlying stream object.
         */
        public readonly stream: NodeJS.WritableStream;

        /**
         * Sets whether the uncork should be deferred to process.nextTick
         * or should be called immediately.
         */
        public /* writeonly */ deferUncork: boolean;

        private _stream: NodeJS.WritableStream;
        private _deferUncork: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(stream: NodeJS.WritableStream, verbosity?: number, decorated?: boolean, formatter?: OutputFormatterInterface): void;
        constructor(stream: NodeJS.WritableStream, verbosity?: number, decorated?: boolean, formatter?: OutputFormatterInterface);

        /**
         * @inheritdoc
         */
        protected _doWrite(message: string, newline: boolean): void;

        /**
         * Determine if the stream supports colors.
         */
        private _hasColorSupport(): boolean;
    }
}
