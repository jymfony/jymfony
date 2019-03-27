declare namespace Jymfony.Component.Console.Output {
    import OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;

    export abstract class Output extends implementationOf(OutputInterface) {
        public verbosity: number;
        public decorated: boolean;
        public formatter: OutputFormatterInterface;

        private _verbosity: number;
        private _formatter: OutputFormatterInterface;

        /**
         * Constructor.
         *
         * @param [verbosity = Jymfony.Component.Console.Output.ConsoleOutputInterface.VERBOSITY_NORMAL]
         * @param [decorated = false]
         * @param [formatter = new Jymfony.Component.Console.Output.OutputFormatter()]
         */
        __construct(verbosity?: number, decorated?: boolean, formatter?: OutputFormatterInterface): void;
        constructor(verbosity?: number, decorated?: boolean, formatter?: OutputFormatterInterface);

        /**
         * @inheritdoc
         */
        write(messages: string|string[], newline?: boolean, options?: number): void;

        /**
         * @inheritdoc
         */
        writeln(messages?: string | string[], options?: number): void;

        /**
         * @inheritdoc
         */
        isQuiet(): boolean;

        /**
         * @inheritdoc
         */
        isVerbose(): boolean;

        /**
         * @inheritdoc
         */
        isVeryVerbose(): boolean;

        /**
         * @inheritdoc
         */
        isDebug(): boolean;

        /**
         * Writes a message to the output.
         *
         * @param message A message to write to the output
         * @param newline Whether to add a newline or not
         *
         * @protected
         */
        protected abstract _doWrite(message: string, newline: boolean);
    }
}
