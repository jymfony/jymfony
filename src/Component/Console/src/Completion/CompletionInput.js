const ArgvInput = Jymfony.Component.Console.Input.ArgvInput;

/**
 * An input specialized for shell completion.
 *
 * This input allows unfinished option names or values and exposes what kind of
 * completion is expected.
 *
 * @memberOf Jymfony.Component.Console.Completion
 */
export default class CompletionInput extends ArgvInput {
    /**
     * Constructor.
     *
     * @param {string[]} argv
     * @param {Jymfony.Component.Console.Input.InputDefinition} [definition]]
     */
    __construct(argv = process.argv, definition = undefined) {
        super.__construct(argv, definition);

        /**
         * @type {int | null}
         *
         * @private
         */
        this._currentIndex = null;

        /**
         * @type {string | null}
         *
         * @private
         */
        this._completionType = null;

        /**
         * @type {string | null}
         *
         * @private
         */
        this._completionName = null;

        /**
         * @type {string}
         *
         * @private
         */
        this._completionValue = '';
    }

    /**
     * @returns {string[]}
     */
    get tokens() {
        return [ ...this._tokens ];
    }

    /**
     * @returns {number}
     */
    get currentIndex() {
        return this._currentIndex;
    }

    /**
     * Converts a terminal string into tokens.
     *
     * This is required for shell completions without COMP_WORDS support.
     *
     * @param {string} inputStr
     * @param {int} currentIndex
     */
    static fromString(inputStr, currentIndex) {
        const regex = /(?<=^|\s)([\'"]?)(.+?)(?<!\\\\)\1(?=$|\s)/g;
        const tokens = [];

        let m;
        while (m = regex.exec(inputStr)) {
            tokens.push(m[0]);
        }

        return __self.fromTokens(tokens, currentIndex);
    }

    /**
     * Create an input based on an COMP_WORDS token list.
     *
     * @param {string[]} tokens the set of split tokens (e.g. COMP_WORDS or argv)
     * @param {int} currentIndex the index of the cursor (e.g. COMP_CWORD)
     *
     * @returns {Jymfony.Component.Console.Completion.CompletionInput}
     */
    static fromTokens(tokens, currentIndex) {
        const input = new __self(tokens);
        input._tokens = tokens;
        input._currentIndex = currentIndex;

        return input;
    }

    /**
     * @inheritdoc
     */
    bind(definition) {
        const cmdName = this._tokens.shift();
        super.bind(definition);
        this._tokens.unshift(cmdName);

        const relevantToken = this._getRelevantToken();
        if ('-' === relevantToken[0]) {
            // The current token is an input option: complete either option name or option value
            const { optionToken, optionValue } = (() => {
                if (! relevantToken.includes('=')) {
                    return { optionToken: relevantToken, optionValue: '' };
                }

                const m = relevantToken.match(/^(.+)=(.*)/);
                return {
                    optionToken: m[1],
                    optionValue: m[2] || '',
                };
            })();

            const option = this._getOptionFromToken(optionToken);
            if (null === option && !this._isCursorFree()) {
                this._completionType = __self.TYPE_OPTION_NAME;
                this._completionValue = relevantToken;

                return;
            }

            if (null !== option && option.acceptValue()) {
                this._completionType = __self.TYPE_OPTION_VALUE;
                this._completionName = option.getName();
                this._completionValue = optionValue || (!optionToken.startsWith('--') ? optionToken.substring(2) : '');

                return;
            }
        }

        const previousToken = this._tokens[this._currentIndex - 1];
        if ('-' === previousToken[0] && '' !== __jymfony.trim(previousToken, '-')) {
            // Check if previous option accepted a value
            const previousOption = this._getOptionFromToken(previousToken);
            if (null !== previousOption && previousOption.acceptValue()) {
                this._completionType = __self.TYPE_OPTION_VALUE;
                this._completionName = previousOption.getName();
                this._completionValue = relevantToken;

                return;
            }
        }

        // Complete argument value
        this._completionType = __self.TYPE_ARGUMENT_VALUE;

        let argumentName = '';
        for (const argument of this._definition.getArguments()) {
            argumentName = argument.getName();
            if (undefined === this._arguments[argumentName]) {
                break;
            }

            const argumentValue = this._arguments[argumentName];
            this._completionName = argumentName;
            if (isArray(argumentValue)) {
                this._completionValue = 0 < argumentValue.length ? argumentValue[argumentValue.length - 1] : null;
            } else {
                this._completionValue = argumentValue;
            }
        }

        if (this._currentIndex >= this._tokens.length) {
            if (undefined === this._arguments[argumentName] || this._definition.getArgument(argumentName).isArray()) {
                this._completionName = argumentName;
                this._completionValue = '';
            } else {
                // We've reached the end
                this._completionType = __self.TYPE_NONE;
                this._completionName = null;
                this._completionValue = '';
            }
        }
    }

    /**
     * Returns the type of completion required.
     *
     * TYPE_ARGUMENT_VALUE when completing the value of an input argument
     * TYPE_OPTION_VALUE   when completing the value of an input option
     * TYPE_OPTION_NAME    when completing the name of an input option
     * TYPE_NONE           when nothing should be completed
     *
     * @returns {string} One of TYPE_* constants.
     */
    get completionType() {
        return this._completionType;
    }

    /**
     * The name of the input option or argument when completing a value.
     *
     * @returns {string|null} returns null when completing an option name
     */
    get completionName() {
        return this._completionName;
    }

    /**
     * The value already typed by the user (or empty string).
     */
    get completionValue() {
        return this._completionValue;
    }

    mustSuggestOptionValuesFor(optionName) {
        return __self.TYPE_OPTION_VALUE === this.completionType && optionName === this.completionName;
    }

    mustSuggestArgumentValuesFor(argumentName) {
        return __self.TYPE_ARGUMENT_VALUE === this.completionType && argumentName === this.completionName;
    }

    _parseToken(token, parseOptions) {
        try {
            return super._parseToken(token, parseOptions);
        } catch {
            // Suppress errors, completed input is almost never valid
        }

        return parseOptions;
    }

    _getOptionFromToken(optionToken) {
        const optionName = __jymfony.ltrim(optionToken, '-');
        if (!optionName) {
            return null;
        }

        if ('-' === (optionToken[1] || ' ')) {
            // Long option name
            return this._definition.hasOption(optionName) ? this._definition.getOption(optionName) : null;
        }

        // Short option name
        return this._definition.hasShortcut(optionName[0]) ? this._definition.getOptionForShortcut(optionName[0]) : null;
    }

    /**
     * The token of the cursor, or the last token if the cursor is at the end of the input.
     */
    _getRelevantToken() {
        return this._tokens[this._isCursorFree() ? this._currentIndex - 1 : this._currentIndex];
    }

    /**
     * Whether the cursor is "free" (i.e. at the end of the input preceded by a space).
     */
    _isCursorFree() {
        if (this._currentIndex > this._tokens.length) {
            throw new LogicException('Current index is invalid, it must be the number of input tokens or one more.');
        }

        return this._currentIndex >= this._tokens.length;
    }

    toString() {
        let str = '', i, token;
        for ([ i, token ] of __jymfony.getEntries(this._tokens)) {
            str += token;

            if (this._currentIndex === i) {
                str += '|';
            }

            str += ' ';
        }

        if (this._currentIndex > i) {
            str += '|';
        }

        return __jymfony.rtrim(str);
    }
}

Object.defineProperty(CompletionInput, 'TYPE_ARGUMENT_VALUE', { value: 'argument_value', writable: false });
Object.defineProperty(CompletionInput, 'TYPE_OPTION_VALUE', { value: 'option_value', writable: false });
Object.defineProperty(CompletionInput, 'TYPE_OPTION_NAME', { value: 'option_name', writable: false });
Object.defineProperty(CompletionInput, 'TYPE_NONE', { value: 'none', writable: false });
