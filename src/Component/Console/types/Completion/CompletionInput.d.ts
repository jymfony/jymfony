declare namespace Jymfony.Component.Console.Completion {
    import ArgvInput = Jymfony.Component.Console.Input.ArgvInput;
    import InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
    import InputOption = Jymfony.Component.Console.Input.InputOption;

    /**
     * An input specialized for shell completion.
     *
     * This input allows unfinished option names or values and exposes what kind of
     * completion is expected.
     */
    export class CompletionInput extends ArgvInput {
        public static readonly TYPE_ARGUMENT_VALUE: string;
        public static readonly TYPE_OPTION_VALUE: string;
        public static readonly TYPE_OPTION_NAME: string;
        public static readonly TYPE_NONE: string;

        private _currentIndex: number | null;
        private _completionType: string | null;
        private _completionName: string | null;
        private _completionValue: string;

        /**
         * Constructor.
         */
        __construct(argv?: string[], definition?: InputDefinition): void;
        constructor(argv?: string[], definition?: InputDefinition);

        /**
         * Converts a terminal string into tokens.
         *
         * This is required for shell completions without COMP_WORDS support.
         */
        static fromString(inputStr: string, currentIndex: number): CompletionInput;

        /**
         * Create an input based on an COMP_WORDS token list.
         *
         * @param tokens the set of split tokens (e.g. COMP_WORDS or argv)
         * @param currentIndex the index of the cursor (e.g. COMP_CWORD)
         */
        static fromTokens(tokens: string[], currentIndex: number): CompletionInput;

        /**
         * @inheritdoc
         */
        bind(definition: InputDefinition): void;

        /**
         * Returns the type of completion required.
         *
         * TYPE_ARGUMENT_VALUE when completing the value of an input argument
         * TYPE_OPTION_VALUE   when completing the value of an input option
         * TYPE_OPTION_NAME    when completing the name of an input option
         * TYPE_NONE           when nothing should be completed
         *
         * @returns One of TYPE_* constants.
         */
        public readonly completionType: string;

        /**
         * The name of the input option or argument when completing a value.
         *
         * @returns returns null when completing an option name
         */
        public readonly completionName: string | null;

        /**
         * The value already typed by the user (or empty string).
         */
        public readonly completionValue: string;

        mustSuggestOptionValuesFor(optionName: string): boolean;

        mustSuggestArgumentValuesFor(argumentName: string): boolean;

        protected _parseToken(token: string, parseOptions: boolean): boolean;

        private _getOptionFromToken(optionToken: string): null | InputOption;

        /**
         * The token of the cursor, or the last token if the cursor is at the end of the input.
         */
        private _getRelevantToken(): string;

        /**
         * Whether the cursor is "free" (i.e. at the end of the input preceded by a space).
         */
        private _isCursorFree(): boolean;

        toString(): string;
    }
}
