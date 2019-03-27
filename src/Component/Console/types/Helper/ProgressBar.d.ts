declare namespace Jymfony.Component.Console.Helper {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * The ProgressBar provides helpers to display progress output.
     *
     * @final
     */
    export class ProgressBar {
        public static formatters: Record<string, Invokable<string>>;
        public static formats: Record<string, string>;

        public emptyBarCharacter: string;
        public progressCharacter: string;

        /**
         * The progress bar max steps
         */
        public readonly maxSteps: number;

        /**
         * The progress bar step
         */
        public progress: number;

        /**
         * The progress bar start time.
         */
        public readonly startTime: number;

        /**
         * The current progress bar percent
         */
        public readonly progressPercent: number;

        /**
         * The progress bar size
         */
        public barWidth: number;

        /**
         * The bar character.
         */
        public barCharacter: string;

        /**
         * Sets the progress bar format.
         */
        public /* writeonly */ format: string;

        /**
         * Sets the redraw frequency.
         */
        public /* writeonly */ redrawFrequency: number;

        /**
         * Sets whether to overwrite the progressbar, false for new line.
         */
        public /* writeonly */ overwrite: boolean;

        /**
         * Sets the progress bar format.
         */
        public /* writeonly */ realFormat: string;

        // Options
        private _barWidth: number;
        private _redrawFreq: number;

        private _step: number;
        private _percent: number;
        private _messages: Record<string, string>;
        private _overwrite: boolean;
        private _firstRun: boolean;

        private _output: OutputInterface;
        private _max: number;
        private _stepWidth: number;
        private _terminal: Terminal;

        private _startTime: number;

        /**
         * Constructor.
         *
         * @param output An OutputInterface instance
         * @param [max = 0] Maximum steps (0 if unknown)
         */
        __construct(output: OutputInterface, max?: number): void;
        constructor(output: OutputInterface, max?: number);

        /**
         * Sets a placeholder formatter for a given name.
         *
         * This method also allow you to override an existing placeholder.
         *
         * @param name The placeholder name (including the delimiter char like %)
         * @param callable
         */
        static setPlaceholderFormatterDefinition(name: string, callable: Invokable<string>): void;

        /**
         * Gets the placeholder formatter for a given name.
         *
         * @param name The placeholder name (including the delimiter char like %)
         */
        static getPlaceholderFormatterDefinition(name: string): Invokable<string>|undefined;

        /**
         * Sets a format for a given name.
         *
         * This method also allow you to override an existing format.
         */
        static setFormatDefinition(name: string, format: string): void;

        /**
         * Gets the format for a given name.
         */
        static getFormatDefinition(name: string): string|undefined;

        /**
         * Associates a text with a named placeholder.
         *
         * The text is displayed when the progress bar is rendered but only
         * when the corresponding placeholder is part of the custom format line
         * (by wrapping the name with %).
         *
         * @param message The text to associate with the placeholder
         * @param [name = 'message'] The name of the placeholder
         */
        setMessage(message: string, name?: string): void;

        getMessage(name?: string): string|undefined;

        /**
         * Starts the progress output.
         *
         * @param [max] Number of steps to complete the bar (0 if indeterminate), null to leave unchanged
         */
        start(max?: number|undefined): void;

        /**
         * Advances the progress output X steps.
         *
         * @param [step = 1] Number of steps to advance
         */
        advance(step?: number): void;

        /**
         * Finishes the progress output.
         */
        finish(): void;

        /**
         * Outputs the current progress string.
         */
        display(): void

        /**
         * Removes the progress bar from the current line.
         *
         * This is useful if you wish to write some output
         * while a progress bar is running.
         * Call display() to show the progress bar again.
         */
        clear(): void;

        /**
         * Overwrites a previous message to the output.
         */
        private _ow(message: string): void;

        private _determineBestFormat(): string;

        private static _initPlaceholderFormatters(): Record<string, Invokable<string>>;

        private static _initFormats(): Record<string, string>;

        private _buildLine(): string;
    }
}
