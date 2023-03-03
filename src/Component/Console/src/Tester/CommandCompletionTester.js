const CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
const CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;

/**
 * Eases the testing of command completion.
 *
 * @memberOf Jymfony.Component.Console.Tester
 */
export default class CommandCompletionTester {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Command.Command} command
     */
    __construct(command) {
        /**
         * @type {Jymfony.Component.Console.Command.Command}
         *
         * @private
         */
        this._command = command;
    }

    /**
     * Create completion suggestions from input tokens.
     *
     * @param {string[]} input
     */
    async complete(input) {
        const currentIndex = input.length;
        if ('' === input[input.length - 1]) {
            input.pop();
        }

        input.unshift(this._command.name);

        const completionInput = CompletionInput.fromTokens(input, currentIndex);
        completionInput.bind(this._command.definition);

        const suggestions = new CompletionSuggestions();
        await this._command.complete(completionInput, suggestions);

        const options = [];
        for (const option of suggestions.optionSuggestions) {
            options.push('--' + option.name);
        }

        return [ ...options, ...suggestions.valueSuggestions ].map(String);
    }
}
