declare namespace Jymfony.Component.Console.Output {
    import OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;

    /**
     * @memberOf Jymfony.Component.Console.Output
     *
     * @final
     */
    export class NullOutput extends implementationOf(OutputInterface) {
        public verbosity: number;
        public decorated: boolean;
        public formatter: OutputFormatterInterface;

        /**
         * @inheritdoc
         */
        write(messages: string | string[], newline?: boolean, options?: number): void;

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
    }
}
