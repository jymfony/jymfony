const SyntaxError = Jymfony.Component.Lexer.Exception.SyntaxError;
const ValueHolder = Jymfony.Component.Lexer.ValueHolder;

/**
 * @memberOf Jymfony.Component.Lexer
 *
 * @abstract
 */
export default class AbstractLexer {
    __construct() {
        /**
         * @type {Jymfony.Component.Lexer.Token|undefined}
         */
        this.token = undefined;

        /**
         * @type {Jymfony.Component.Lexer.Token|undefined}
         */
        this.lookahead = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._peek = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._position = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._input = undefined;

        /**
         * @type {Jymfony.Component.Lexer.Token[]}
         *
         * @private
         */
        this._tokens = [];
    }

    /**
     * Reset the lexer
     */
    reset() {
        this.token = undefined;
        this.lookahead = undefined;
        this._peek = 0;
        this._position = 0;
    }

    /**
     * Resets the peek pointer to 0.
     */
    resetPeek() {
        this._peek = 0;
    }

    /**
     * Resets the lexer position on the input to the given position.
     *
     * @param {int} [position = 0] Position to place the lexical scanner.
     */
    resetPosition(position = 0) {
        this._position = position;
    }

    /**
     * Retrieve the original lexer's input until a given position.
     *
     * @param {int} position
     *
     * @returns {string}
     */
    getInputUntilPosition(position) {
        return this._input.substr(0, position);
    }

    /**
     * Checks whether a given token matches the current lookahead.
     *
     * @param {int|string} token
     *
     * @returns {boolean}
     */
    isNextToken(token) {
        return undefined !== this.lookahead && this.lookahead.type === token;
    }

    /**
     * Checks whether any of the given tokens matches the current lookahead.
     *
     * @param {(int|string)[]} tokens
     *
     * @returns {boolean}
     */
    isNextTokenAny(tokens) {
        return undefined !== this.lookahead && -1 !== tokens.indexOf(this.lookahead.type);
    }

    /**
     * Moves to the next token in the input string.
     *
     * @returns {boolean}
     */
    moveNext() {
        this._peek = 0;
        this.token = this._tokens[this._position];
        this.lookahead = this._tokens[this._position + 1];
        this._position++;

        return this.token !== undefined;
    }

    /**
     * Tells the lexer to skip input tokens until it sees a token with the given value.
     *
     * @param {int|string} type The token type to skip until.
     */
    skipUntil(type) {
        while (this.token && this.token.type !== type) {
            this.moveNext();
        }
    }

    /**
     * Checks if given value is identical to the given token.
     *
     * @param {*} value
     * @param {int|string} token
     *
     * @returns {boolean}
     */
    isA(value, token) {
        const holder = new ValueHolder(value);

        return this.getType(holder) === token;
    }

    /**
     * Moves the lookahead token forward.
     *
     * @returns {Jymfony.Component.Lexer.Token|undefined} The next token or undefined if there are no more tokens ahead.
     */
    peek() {
        if (this._tokens[this._position + this._peek]) {
            return this._tokens[this._position + this._peek++];
        }

        return undefined;
    }

    /**
     * Peeks at the next token, returns it and immediately resets the peek.
     *
     * @returns {Jymfony.Component.Lexer.Token|undefined} The next token or undefined if there are no more tokens ahead.
     */
    glimpse() {
        const peek = this.peek();
        this._peek = 0;

        return peek;
    }

    /**
     * Gets the literal for a given token.
     *
     * @param {int|string} token
     *
     * @returns {string}
     */
    getLiteral(token) {
        const reflClass = new ReflectionClass(this);
        const constants = reflClass.constants;

        for (const [ name, value ] of __jymfony.getEntries(constants)) {
            if (value === token) {
                return name;
            }
        }

        return token.toString();
    }

    /**
     * Gets the original input data.
     *
     * @returns {string}
     */
    get input() {
        return this._input;
    }

    /**
     * Sets the input data to be tokenized.
     *
     * The Lexer is immediately reset and the new input tokenized.
     * Any unprocessed tokens from any previous input are lost.
     *
     * @param {string} input The input to be tokenized.
     */
    set input(input) {
        this._input = input;
        this._tokens = [];

        this.reset();
        this._scan(input);
    }

    /**
     * Scans the input string for tokens.
     *
     * @param {string} input A query string.
     */
    _scan(input) {
        const inputLen = input.length;
        let non_catchable = this.getNonCatchablePatterns();
        if (non_catchable.length) {
            non_catchable = '|' + non_catchable.join('|');
        } else {
            non_catchable = '';
        }

        const regex = new RegExp(__jymfony.sprintf(
            '((?:%s))%s', this.getCatchablePatterns().join(')|(?:'), non_catchable
        ), 'g' + this.getModifiers());

        let match;
        let lastIndex = 0;
        while ((match = regex.exec(input))) {
            if (match.index >= inputLen || lastIndex !== match.index) {
                break;
            }

            lastIndex = match.index + match[0].length;

            if (undefined === match[1]) {
                continue;
            }

            const holder = this.createValueHolder(match[0]);
            const type = this.getType(holder);

            this._tokens.push({
                value: holder.value,
                type,
                position: match.index,
                index: this._tokens.length,
            });
        }

        if (lastIndex < inputLen) {
            throw new SyntaxError('Cannot parse near "' + input.substr(lastIndex, 15) + '"');
        }
    }

    /**
     * Iterates through the tokens
     */
    * [Symbol.iterator]() {
        yield * this._tokens;
    }

    /**
     * Regex modifiers
     *
     * @returns {string}
     *
     * @protected
     */
    getModifiers() {
        return 'i';
    }

    /**
     * Lexical catchable patterns.
     *
     * @returns {string[]}
     *
     * @protected
     *
     * @abstract
     */
    getCatchablePatterns() {
        throw new Error('You must override getCatchablePatterns method');
    }

    /**
     * Lexical non-catchable patterns.
     *
     * @returns {string[]}
     *
     * @protected
     *
     * @abstract
     */
    getNonCatchablePatterns() {
        throw new Error('You must override getNonCatchablePatterns method');
    }

    /**
     * Retrieve token type. Also processes the token value if necessary.
     *
     * @param {Jymfony.Contracts.Lexer.ValueHolderInterface} holder
     *
     * @returns {int|string}
     *
     * @protected
     *
     * @abstract
     */
    getType(holder) { // eslint-disable-line no-unused-vars
        throw new Error('You must override getType method');
    }

    /**
     * Creates a new instance of value holder.
     *
     * @param {*} value
     *
     * @returns {Jymfony.Contracts.Lexer.ValueHolderInterface}
     *
     * @protected
     */
    createValueHolder(value) {
        return new ValueHolder(value);
    }
}
