declare namespace Jymfony.Component.Console.Output {
    import OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;

    export class BufferedOutput extends Output {
        private _buffer: string;

        /**
         * @inheritdoc
         */
        __construct(verbosity?: number, decorated?: boolean, formatter?: OutputFormatterInterface): void;
        constructor(verbosity?: number, decorated?: boolean, formatter?: OutputFormatterInterface);

        /**
         * Empties buffer and returns its content.
         */
        fetch(): string;

        /**
         * @inheritdoc
         */
        protected _doWrite(message: string, newline: boolean): void;
    }
}
