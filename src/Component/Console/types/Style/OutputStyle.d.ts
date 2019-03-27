declare namespace Jymfony.Component.Console.Style {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;

    /**
     * Decorates output to add console style guide helpers.
     */
    export class OutputStyle extends implementationOf(OutputInterface) {
        public decorated: boolean;
        public formatter: OutputFormatterInterface;
        public verbosity: number;

        private _output: OutputInterface;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.Console.Output.OutputInterface} output
         */
        __construct(output: OutputInterface): void;
        constructor(output: OutputInterface);

        /**
         * @inheritdoc
         */
        newLine(count?: number): void;

        /**
         * @inheritdoc
         */
        write(messages: string|string[], newline?: boolean, options?: number): void;

        /**
         * @inheritdoc
         */
        writeln(messages?: string|string[], options?: number): void;

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
         * Gets the error output.
         */
        protected _getErrorOutput(): OutputInterface;
    }
}
