declare namespace Jymfony.Component.Console.Helper {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * @final
     */
    export class ProgressIndicator {
        public static formatters: Record<string, Invokable<string>>;
        public static formats: Record<string, string>;

        /**
         * Constructor.
         */
        __construct(output: OutputInterface, format?: string|undefined, indicatorChangeInterval?: number, indicatorValues?: string[]|undefined): void;
        constructor(output: OutputInterface, format?: string|undefined, indicatorChangeInterval?: number, indicatorValues?: string[]|undefined);

        private _started: boolean;
        private _message: string;
        private _output: OutputInterface;
        private _format: string;
        private _indicatorChangeInterval: number;
        private _indicatorValues: string[];
        private _startTime: number;

        /**
         * Sets the current indicator message.
         */
        public /* writeonly */ message: string|undefined;

        /**
         * Starts the indicator output.
         */
        start(message?: string|undefined): void;

        /**
         * Advances the indicator.
         */
        advance(): void;

        /**
         * Finish the indicator with message.
         */
        finish(message?: string|undefined): void;

        /**
         * Gets the format for a given name.
         */
        static getFormatDefinition(name: string): string|undefined;

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

        private _display(): void;

        private _determineBestFormat(): string;

        /**
         * Overwrites a previous message to the output.
         */
        private _overwrite(message: string): void;

        private _getCurrentTimeInMilliseconds(): number;

        private _getDefaultIndicators(): string[];

        static initPlaceholderFormatters(): Record<string, Invokable<string>>;

        static initFormats(): Record<string, string>;
    }
}
