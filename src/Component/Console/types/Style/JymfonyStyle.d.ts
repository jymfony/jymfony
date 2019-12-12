declare namespace Jymfony.Component.Console.Style {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import BufferedOutput = Jymfony.Component.Console.Output.BufferedOutput;
    import ProgressBar = Jymfony.Component.Console.Helper.ProgressBar;
    import ProgressIndicator = Jymfony.Component.Console.Helper.ProgressIndicator;
    import Choice = Jymfony.Component.Console.Question.Choice;

    /**
     * Output decorator helpers for the Jymfony Style Guide.
     */
    export class JymfonyStyle extends OutputStyle {
        public static readonly MAX_LINE_LENGTH = 120;

        private _input: InputInterface;
        private _bufferedOutput: BufferedOutput;
        private _lineLength: number;
        private _progress: undefined | ProgressBar | ProgressIndicator;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(input: InputInterface, output: OutputInterface): void;
        constructor(input: InputInterface, output: OutputInterface);

        /**
         * Formats a message as a block of text.
         *
         * @param messages The message to write in the block
         * @param [type] The block type (added in [] on first line)
         * @param [style] The style to apply to the whole block
         * @param [prefix = ' '] The prefix for the block
         * @param [padding = false] Whether to add vertical padding
         * @param [escape = true] Whether to escape the message
         */
        block(messages: string | string[], type?: undefined | string, style?: undefined | string, prefix?: string, padding?: boolean, escape?: boolean): void;

        /**
         * @inheritdoc
         */
        title(message: string): void;

        /**
         * @inheritdoc
         */
        section(message: string): void;

        /**
         * @inheritdoc
         */
        listing(elements: string[]): void;

        /**
         * @inheritdoc
         */
        text(messages: string | string[]): void;

        /**
         * Formats a command comment.
         */
        comment(message: string | string[]): void;

        /**
         * @inheritdoc
         */
        success(message: string | string[]): void;

        /**
         * @inheritdoc
         */
        error(message: string | string[]): void;

        /**
         * @inheritdoc
         */
        warning(message: string | string[]): void;

        /**
         * @inheritdoc
         */
        note(message: string | string[]): void;

        /**
         * @inheritdoc
         */
        caution(message: string | string[]): void;

        /**
         * @inheritdoc
         */
        table(headers: string[], rows: string[][]);

        /**
         * @inheritdoc
         */
        ask(question: string, defaultAnswer?: any, validator?: Invokable<any>): Promise<any>;

        /**
         * @inheritdoc
         */
        askHidden(question: string, validator?: Invokable<any>): Promise<string>;

        /**
         * @inheritdoc
         */
        confirm(question: string, defaultAnswer?: boolean): Promise<boolean>;

        /**
         * @inheritdoc
         */
        choice(question: string, choices: Choice[], multiple: boolean): Promise<any>;

        /**
         * @inheritdoc
         */
        progressStart(max?: number, message?: string): void;

        /**
         * @inheritdoc
         */
        progressAdvance(step?: number, message?: string): void;

        /**
         * @inheritdoc
         */
        progressFinish(message?: string): void;

        /**
         * @inheritdoc
         */
        writeln(messages?: string | string[], options?: number): void;

        /**
         * @inheritdoc
         */
        write(messages: string | string[], newline?: boolean, options?: number): void;

        /**
         * @inheritdoc
         */
        newLine(count?: number): void;

        /**
         * Returns a new instance which makes use of stderr if available.
         */
        getErrorStyle(): JymfonyStyle;

        private _getProgress(): ProgressBar | ProgressIndicator;
        private _autoPrependBlock(): void;
        private _autoPrependText(): void;
        private _reduceBuffer(messages: string[]): string[];
        _createBlock(messages: string[], type?: string, style?: undefined | string, prefix?: string, padding?: boolean, escape?: boolean): string[];
    }
}
