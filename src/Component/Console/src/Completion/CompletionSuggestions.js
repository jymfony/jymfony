const Suggestion = Jymfony.Component.Console.Completion.Suggestion;

/**
 * Stores all completion suggestions for the current input.
 *
 * @memberOf Jymfony.Component.Console.Completion
 * @final
 */
export default class CompletionSuggestions {
    __construct() {
        /**
         * @type {Jymfony.Component.Console.Completion.Suggestion[]}
         *
         * @private
         */
        this._valueSuggestions = [];

        /**
         * @type {Jymfony.Component.Console.Input.InputOption[]}
         *
         * @private
         */
        this._optionSuggestions = [];
    }

    /**
     * Add a suggested value for an input option or argument.
     *
     * @param {string | Jymfony.Component.Console.Completion.Suggestion} value
     *
     * @returns {this}
     */
    suggestValue(value) {
        this._valueSuggestions.push(!value instanceof Suggestion ? new Suggestion(value) : value);

        return this;
    }

    /**
     * Add multiple suggested values at once for an input option or argument.
     *
     * @param {array<string | Jymfony.Component.Console.Completion.Suggestion>} values
     *
     * @returns {this}
     */
    suggestValues(values) {
        for (const value of values) {
            this.suggestValue(value);
        }

        return this;
    }

    /**
     * Add a suggestion for an input option name.
     *
     * @param {Jymfony.Component.Console.Input.InputOption} option
     *
     * @returns {this}
     */
    suggestOption(option) {
        this._optionSuggestions.push(option);

        return this;
    }

    /**
     * Add multiple suggestions for input option names at once.
     *
     * @param {Jymfony.Component.Console.Input.InputOption[]} options
     *
     * @returns {this}
     */
    suggestOptions(options) {
        for (const option of options) {
            this.suggestOption(option);
        }

        return this;
    }

    /**
     * @returns {Jymfony.Component.Console.Input.InputOption[]}
     */
    get optionSuggestions() {
        return this._optionSuggestions;
    }

    /**
     * @returns {Jymfony.Component.Console.Completion.Suggestion[]}
     */
    get valueSuggestions() {
        return this._valueSuggestions;
    }
}
