declare namespace Jymfony.Component.Console.Completion {
    import InputOption = Jymfony.Component.Console.Input.InputOption;
    import Suggestion = Jymfony.Component.Console.Completion.Suggestion;

    /**
     * Stores all completion suggestions for the current input.
     *
     * @final
     */
    export class CompletionSuggestions {
        private _valueSuggestions: Suggestion[];
        private _optionSuggestions: InputOption[];

        __construct(): void;
        constructor();

        /**
         * Add a suggested value for an input option or argument.
         */
        suggestValue(value: string | Suggestion): this;

        /**
         * Add multiple suggested values at once for an input option or argument.
         */
        suggestValues(values: (string | Suggestion)[]): this;

        /**
         * Add a suggestion for an input option name.
         */
        suggestOption(option: InputOption): this;

        /**
         * Add multiple suggestions for input option names at once.
         */
        suggestOptions(options: InputOption[]): this;

        public readonly optionSuggestions: InputOption[];
        public readonly valueSuggestions: Suggestion[];
    }
}
