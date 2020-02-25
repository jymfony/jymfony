const ValueHolder = require('./ValueHolder');
const NotARegExpException = require('./Exception/NotARegExpException');
const WrongAssignmentException = require('./Exception/WrongAssignmentException');

/**
 * Lexer for js code.
 * Based upon the Lexer component, part of its code is duplicated here
 * as it is fundamental part of the class loader/compiler.
 *
 * @memberOf Jymfony.Component.Autoloader.Parser
 */
class Lexer {
    /**
     * Constructor.
     */
    constructor() {
        /**
         * @type {RegExp}
         *
         * @private
         */
        this._spaces = new RegExp('^[' + Lexer.SPACES + ']+$', 'g');

        /**
         * @type {RegExp}
         *
         * @private
         */
        this._reservedKeywords = new RegExp('^' + Lexer.RESERVED_WORDS + '$', 'g');

        /**
         * @type {RegExp}
         *
         * @private
         */
        this._identifiers = new RegExp('^' + Lexer.IDENTIFIER + '$', 'g');

        /**
         * @type {RegExp}
         *
         * @private
         */
        this._numbers = new RegExp('^' + Lexer.NUMBERS + '$', 'g');

        /**
         * @type {RegExp}
         *
         * @private
         */
        this._regexes = new RegExp('(?<=((?:^|[\\n;`=<>!~+\\-/%*&,?|:()[\\]{}]|' + Lexer.RESERVED_WORDS + ')\\s*))\\/((?![*+?])(?:[^\\r\\n\\[/\\\\]|\\\\.|\\[(?:[^\\r\\n\\]\\\\]|\\\\.)*\\])+)\\/w*', 'g');

        /**
         * @type {Object}
         *
         * @private
         */
        this._last = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._input = undefined;
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
     * Gets the current position.
     *
     * @returns {int}
     */
    get position() {
        return this._position;
    }

    /**
     * Resets the lexer position on the input to the given position.
     *
     * @param {int} position Position to place the lexical scanner.
     */
    resetPosition(position = 0) {
        this._position = position;
        this.moveNext();
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
     * @param {Array} tokens
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

        return this.token !== undefined && Lexer.T_EOF !== this.token.type;
    }

    /**
     * Tells the lexer to skip input tokens until it sees a token with the given value.
     *
     * @param {string} type The token type to skip until.
     */
    skipUntil(type) {
        while (this.lookahead && this.lookahead.type !== type) {
            this.moveNext();
        }
    }

    /**
     * Checks if given value is identical to the given token.
     *
     * @param {*} value
     * @param {int} token
     *
     * @returns {boolean}
     */
    isA(value, token) {
        return this.getType(value) === token;
    }

    /**
     * Checks if current token is of a given type.
     *
     * @param {int} token
     *
     * @returns {boolean}
     */
    isToken(token) {
        return this.token && this.token.type === token;
    }

    /**
     * Moves the lookahead token forward.
     *
     * @returns {Object|undefined} The next token or undefined if there are no more tokens ahead.
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
     * @returns {Object|undefined} The next token or undefined if there are no more tokens ahead.
     */
    glimpse() {
        const peek = this.peek();
        this._peek = 0;

        return peek;
    }

    /**
     * Gets the literal for a given token.
     *
     * @param {int} token
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
     * Re-scans a single token.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Token} token
     * @param {Error} err
     */
    rescan(token, err) {
        this._last = undefined;
        const regex = new RegExp('((?:' + this.getPatterns().join(')|(?:') + '))', 'g');

        const tokens = [];
        let match, value = token.value, offset = token.position;

        if (err instanceof NotARegExpException || err instanceof WrongAssignmentException) {
            tokens.push({
                value: value[0],
                type: this.getType(new ValueHolder(value[0])),
                position: offset,
                index: 0,
            });

            value = value.substr(1);
            offset++;
        } else {
            throw new Exception('Unknown rescan reason');
        }

        while ((match = regex.exec(value))) {
            const holder = new ValueHolder(match[0]);
            const type = this.getType(holder);

            tokens.push({
                value: holder.value,
                type: type,
                position: match.index + offset,
                index: 0,
            });
        }

        this._tokens.splice(token.index, 1, ...tokens);
        for (const [ index, tok ] of __jymfony.getEntries(this._tokens)) {
            tok.index = index;
        }
    }

    /**
     * Scans the input string for tokens.
     *
     * @param {string} input A query string.
     * @param {int} offset
     */
    _scan(input, offset = 0) {
        this._last = undefined;
        const regex = new RegExp('((?:' + this.getPatterns().join(')|(?:') + '))', 'g');

        let match;
        while ((match = regex.exec(input))) {
            const holder = new ValueHolder(match[0]);
            const type = this.getType(holder);

            this._tokens.push({
                value: holder.value,
                type: type,
                position: match.index + offset,
                index: this._tokens.length,
            });
        }

        this._tokens.push({
            value: 'end-of-file',
            type: Lexer.T_EOF,
            position: input.length,
            index: this._tokens.length,
        });
    }

    /**
     * Iterates through the tokens
     */
    * [Symbol.iterator]() {
        yield * this._tokens;
    }

    /**
     * @returns {string[]}
     */
    getPatterns() {
        return [
            '\\.\\.\\.',
            '\\?\\.',
            Lexer.NUMBERS,
            '`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]|[^}])*\\}?)*?[`]',
            '[\'](?:\\\\(?=\\n|\\r|\\r\\n|\u2028|\u2029)[\\r\\n\u2028\u2029]*|[^\\\'\\\\\\r\\n\u2028\u2029]|\\\\.)*?[\']',
            '["](?:\\\\(?=\\n|\\r|\\r\\n|\u2028|\u2029)[\\r\\n\u2028\u2029]*|[^"\\\\\\r\\n\u2028\u2029]|\\\\.)*?["]',
            '(\\/\\*([^*]|[\\r\\n]|(\\*+([^*\\/]|[\\r\\n])))*\\*+\\/)|(\\/\\/.*)|(?:<!--.*)|((?<=^|\\s+)-->.*)',
            '(?<=((?:^|[\\n;`=<>!~+\\-/%*&,?|:()[\\]{}]|'+Lexer.RESERVED_WORDS+')\\s*))\\/((?![*+?])(?:[^\\r\\n\\[/\\\\]|\\\\.|\\[(?:[^\\r\\n\\]\\\\]|\\\\.)*\\])+)\\/\\w*',
            '\\b'+Lexer.RESERVED_WORDS+'\\b',
            '[\\(\\)\\[\\]\\.\\{\\};]',
            '[`=<>!~+\\-/%*&?|:^]+(?=\\/((?![*+?\\s])(?:[^\\r\\n\\[/\\\\]|\\\\.|\\[(?:[^\\r\\n\\]\\\\]|\\\\.)*\\])+)\\/w*)',
            '(?:`|\\|\\||&&|>>>=|<<=|>>=|=>|[<>~+\\-/%*&|^]=|\\|>|>>>|\\*\\*=|\\*\\*|\\+\\+|--|<<|>>|!==|!=|===|==|=|[!~<>!~+\\-/%*&|^]|\\?|:)',
            ',',
            '[' + Lexer.SPACES + ']+',
            '(?:[^' + Lexer.SPACES + '\\\\\\(\\)\\[\\]\\.\\{\\};`=<>!~+\\-/%*&,?|:^]|\\\\u[\\dA-Fa-f]{4}|\\\\u\\{[\\dA-Fa-f]+\\})+',
        ];
    }

    /**
     * @param {Object} holder
     *
     * @returns {int}
     */
    getType(holder) {
        if (holder.value.match(this._spaces)) {
            return Lexer.T_SPACE;
        }

        switch (holder.value.charAt(0)) {
            case '"':
            case '\'':
            case '`':
                return Lexer.T_STRING;

            case '@':
                return Lexer.T_DECORATOR_IDENTIFIER;

            case '<':
                if (holder.value.startsWith('<!--')) {
                    return Lexer.T_COMMENT;
                }

                break;

            case '-':
                if (holder.value.startsWith('-->')) {
                    return Lexer.T_COMMENT;
                }

                break;

            case '/':
                if (holder.value.startsWith('/**')) {
                    return Lexer.T_DOCBLOCK;
                } else if (holder.value.startsWith('//') || holder.value.startsWith('/*')) {
                    return Lexer.T_COMMENT;
                } else if (holder.value.match(this._regexes)) {
                    return Lexer.T_REGEX;
                }
        }

        switch (holder.value) {
            case '.':
            case '?.':
                return Lexer.T_DOT;

            case '...':
                return Lexer.T_SPREAD;

            case '(':
                return Lexer.T_OPEN_PARENTHESIS;

            case ')':
                return Lexer.T_CLOSED_PARENTHESIS;

            case '[':
                return Lexer.T_OPEN_SQUARE_BRACKET;

            case ']':
                return Lexer.T_CLOSED_SQUARE_BRACKET;

            case '{':
                return Lexer.T_CURLY_BRACKET_OPEN;

            case '}':
                return Lexer.T_CURLY_BRACKET_CLOSE;

            case ';':
                return Lexer.T_SEMICOLON;

            case ':':
                return Lexer.T_COLON;

            case ',':
                return Lexer.T_COMMA;

            case '===':
            case '!==':
            case '==':
            case '!=':
            case '<=':
            case '>=':
            case '<':
            case '>':
                return Lexer.T_COMPARISON_OP;

            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
            case '**':

            case '!':
            case '~':
            case '&':
            case '|':
            case '^':
            case '++':
            case '--':
            case '<<':
            case '>>':
            case '>>>':
            case '|>':

            case 'instanceof':
            case 'in':
            case 'delete':
            case 'void':
            case 'typeof':
                return Lexer.T_OPERATOR;

            case '&&':
            case '||':
            case '??':
                return Lexer.T_LOGICAL_OPERATOR;

            case '=>':
                return Lexer.T_ARROW;

            case '?':
                return Lexer.T_QUESTION_MARK;

            case '=':
            case '+=':
            case '=+':
            case '-=':
            case '=-':
            case '*=':
            case '=*':
            case '/=':
            case '=/':
            case '%=':
            case '=%':
            case '**=':
            case '=**':
            case '~=':
            case '&=':
            case '|=':
            case '^=':
            case '<<=':
            case '=<<':
            case '>>=':
            case '>>>=':
            case '=>>':
            case '=>>>':
                return Lexer.T_ASSIGNMENT_OP;
        }

        if (holder.value.match(this._reservedKeywords)) {
            if (Lexer.T_DOT === this._last) {
                return Lexer.T_IDENTIFIER;
            }

            switch (holder.value) {
                case 'class':
                    return Lexer.T_CLASS;

                case 'extends':
                    return Lexer.T_EXTENDS;

                case 'function':
                    return Lexer.T_FUNCTION;

                case 'decorator':
                    return Lexer.T_DECORATOR;

                case 'static':
                    return Lexer.T_STATIC;

                case 'async':
                    return Lexer.T_ASYNC;

                case 'await':
                    return Lexer.T_AWAIT;

                case 'true':
                    return Lexer.T_TRUE;

                case 'false':
                    return Lexer.T_FALSE;

                case 'throw':
                    return Lexer.T_THROW;

                case 'new':
                    return Lexer.T_NEW;

                case 'if':
                    return Lexer.T_IF;

                case 'else':
                    return Lexer.T_ELSE;

                case 'return':
                    return Lexer.T_RETURN;

                case 'this':
                    return Lexer.T_THIS;

                case 'super':
                    return Lexer.T_SUPER;

                case 'null':
                    return Lexer.T_NULL;

                case 'yield':
                    return Lexer.T_YIELD;

                case 'arguments':
                    return Lexer.T_ARGUMENTS;

                default:
                    return Lexer.T_KEYWORD;
            }
        }

        if (holder.value.match(this._identifiers)) {
            switch (holder.value) {
                case 'get':
                    return Lexer.T_GET;

                case 'set':
                    return Lexer.T_SET;
            }

            return Lexer.T_IDENTIFIER;
        }

        if (holder.value.match(this._numbers)) {
            return Lexer.T_NUMBER;
        }

        return Lexer.T_OTHER;
    }
}

Lexer.T_SPACE = 0;
Lexer.T_STRING = 1;
Lexer.T_DOCBLOCK = 2;
Lexer.T_COMMENT = 3;
Lexer.T_OPEN_PARENTHESIS = 4;
Lexer.T_CLOSED_PARENTHESIS = 5;
Lexer.T_CURLY_BRACKET_OPEN = 6;
Lexer.T_CURLY_BRACKET_CLOSE = 7;
Lexer.T_DOT = 8;
Lexer.T_OPEN_SQUARE_BRACKET = 9;
Lexer.T_CLOSED_SQUARE_BRACKET = 10;
Lexer.T_CLASS = 11;
Lexer.T_EXTENDS = 12;
Lexer.T_KEYWORD = 13;
Lexer.T_IDENTIFIER = 14;
Lexer.T_SEMICOLON = 15;
Lexer.T_ASSIGNMENT_OP = 16;
Lexer.T_COMPARISON_OP = 17;
Lexer.T_COMMA = 18;
Lexer.T_OPERATOR = 19;
Lexer.T_NUMBER = 20;
Lexer.T_COLON = 21;
Lexer.T_FUNCTION = 22;
Lexer.T_REGEX = 23;
Lexer.T_DECORATOR = 24;
Lexer.T_DECORATOR_IDENTIFIER = 25;
Lexer.T_GET = 26;
Lexer.T_SET = 27;
Lexer.T_STATIC = 28;
Lexer.T_ASYNC = 29;
Lexer.T_ARROW = 30;
Lexer.T_QUESTION_MARK = 31;
Lexer.T_TRUE = 32;
Lexer.T_FALSE = 33;
Lexer.T_THROW = 34;
Lexer.T_NEW = 35;
Lexer.T_LOGICAL_OPERATOR = 36;
Lexer.T_IF = 37;
Lexer.T_ELSE = 38;
Lexer.T_RETURN = 39;
Lexer.T_AWAIT = 40;
Lexer.T_THIS = 41;
Lexer.T_SUPER = 42;
Lexer.T_NULL = 43;
Lexer.T_SPREAD = 44;
Lexer.T_YIELD = 45;
Lexer.T_ARGUMENTS = 46;
Lexer.T_OTHER = 255;
Lexer.T_EOF = 256;

Lexer.RESERVED_WORDS = '(?:do|if|in|for|let|new|try|var|case|else|enum|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof|async|await|decorator)';
Lexer.IDENTIFIER = '(?!'+Lexer.RESERVED_WORDS+'$)#?(?:(?:[\\$A-Z_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u037f\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u052f\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u08a0-\\u08b4\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0980\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0af9\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c39\\u0c3d\\u0c58-\\u0c5a\\u0c60\\u0c61\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d5f-\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f5\\u13f8-\\u13fd\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f8\\u1700-\\u170c\\u170e-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1877\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191e\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19b0-\\u19c9\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4b\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1ce9-\\u1cec\\u1cee-\\u1cf1\\u1cf5\\u1cf6\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2118-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309b-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fd5\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua69d\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua7ad\\ua7b0-\\ua7b7\\ua7f7-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua8fd\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\ua9e0-\\ua9e4\\ua9e6-\\ua9ef\\ua9fa-\\ua9fe\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa7e-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uab30-\\uab5a\\uab5c-\\uab65\\uab70-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc]|\\ud800[\\udc00-\\udc0b\\udc0d-\\udc26\\udc28-\\udc3a\\udc3c\\udc3d\\udc3f-\\udc4d\\udc50-\\udc5d\\udc80-\\udcfa\\udd40-\\udd74\\ude80-\\ude9c\\udea0-\\uded0\\udf00-\\udf1f\\udf30-\\udf4a\\udf50-\\udf75\\udf80-\\udf9d\\udfa0-\\udfc3\\udfc8-\\udfcf\\udfd1-\\udfd5]|\\ud801[\\udc00-\\udc9d\\udd00-\\udd27\\udd30-\\udd63\\ude00-\\udf36\\udf40-\\udf55\\udf60-\\udf67]|\\ud802[\\udc00-\\udc05\\udc08\\udc0a-\\udc35\\udc37\\udc38\\udc3c\\udc3f-\\udc55\\udc60-\\udc76\\udc80-\\udc9e\\udce0-\\udcf2\\udcf4\\udcf5\\udd00-\\udd15\\udd20-\\udd39\\udd80-\\uddb7\\uddbe\\uddbf\\ude00\\ude10-\\ude13\\ude15-\\ude17\\ude19-\\ude33\\ude60-\\ude7c\\ude80-\\ude9c\\udec0-\\udec7\\udec9-\\udee4\\udf00-\\udf35\\udf40-\\udf55\\udf60-\\udf72\\udf80-\\udf91]|\\ud803[\\udc00-\\udc48\\udc80-\\udcb2\\udcc0-\\udcf2]|\\ud804[\\udc03-\\udc37\\udc83-\\udcaf\\udcd0-\\udce8\\udd03-\\udd26\\udd50-\\udd72\\udd76\\udd83-\\uddb2\\uddc1-\\uddc4\\uddda\\udddc\\ude00-\\ude11\\ude13-\\ude2b\\ude80-\\ude86\\ude88\\ude8a-\\ude8d\\ude8f-\\ude9d\\ude9f-\\udea8\\udeb0-\\udede\\udf05-\\udf0c\\udf0f\\udf10\\udf13-\\udf28\\udf2a-\\udf30\\udf32\\udf33\\udf35-\\udf39\\udf3d\\udf50\\udf5d-\\udf61]|\\ud805[\\udc80-\\udcaf\\udcc4\\udcc5\\udcc7\\udd80-\\uddae\\uddd8-\\udddb\\ude00-\\ude2f\\ude44\\ude80-\\udeaa\\udf00-\\udf19]|\\ud806[\\udca0-\\udcdf\\udcff\\udec0-\\udef8]|\\ud808[\\udc00-\\udf99]|\\ud809[\\udc00-\\udc6e\\udc80-\\udd43]|[\\ud80c\\ud840-\\ud868\\ud86a-\\ud86c\\ud86f-\\ud872][\\udc00-\\udfff]|\\ud80d[\\udc00-\\udc2e]|\\ud811[\\udc00-\\ude46]|\\ud81a[\\udc00-\\ude38\\ude40-\\ude5e\\uded0-\\udeed\\udf00-\\udf2f\\udf40-\\udf43\\udf63-\\udf77\\udf7d-\\udf8f]|\\ud81b[\\udf00-\\udf44\\udf50\\udf93-\\udf9f]|\\ud82c[\\udc00\\udc01]|\\ud82f[\\udc00-\\udc6a\\udc70-\\udc7c\\udc80-\\udc88\\udc90-\\udc99]|\\ud835[\\udc00-\\udc54\\udc56-\\udc9c\\udc9e\\udc9f\\udca2\\udca5\\udca6\\udca9-\\udcac\\udcae-\\udcb9\\udcbb\\udcbd-\\udcc3\\udcc5-\\udd05\\udd07-\\udd0a\\udd0d-\\udd14\\udd16-\\udd1c\\udd1e-\\udd39\\udd3b-\\udd3e\\udd40-\\udd44\\udd46\\udd4a-\\udd50\\udd52-\\udea5\\udea8-\\udec0\\udec2-\\udeda\\udedc-\\udefa\\udefc-\\udf14\\udf16-\\udf34\\udf36-\\udf4e\\udf50-\\udf6e\\udf70-\\udf88\\udf8a-\\udfa8\\udfaa-\\udfc2\\udfc4-\\udfcb]|\\ud83a[\\udc00-\\udcc4]|\\ud83b[\\ude00-\\ude03\\ude05-\\ude1f\\ude21\\ude22\\ude24\\ude27\\ude29-\\ude32\\ude34-\\ude37\\ude39\\ude3b\\ude42\\ude47\\ude49\\ude4b\\ude4d-\\ude4f\\ude51\\ude52\\ude54\\ude57\\ude59\\ude5b\\ude5d\\ude5f\\ude61\\ude62\\ude64\\ude67-\\ude6a\\ude6c-\\ude72\\ude74-\\ude77\\ude79-\\ude7c\\ude7e\\ude80-\\ude89\\ude8b-\\ude9b\\udea1-\\udea3\\udea5-\\udea9\\udeab-\\udebb]|\\ud869[\\udc00-\\uded6\\udf00-\\udfff]|\\ud86d[\\udc00-\\udf34\\udf40-\\udfff]|\\ud86e[\\udc00-\\udc1d\\udc20-\\udfff]|\\ud873[\\udc00-\\udea1]|\\ud87e[\\udc00-\\ude1d])(?:[\\$0-9a-z_a-z\xaa\xb5\xb7\xba\xc0-\xd6\xd8-\xf6\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0300-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u037f\\u0386-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u0483-\\u0487\\u048a-\\u052f\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0610-\\u061a\\u0620-\\u0669\\u066e-\\u06d3\\u06d5-\\u06dc\\u06df-\\u06e8\\u06ea-\\u06fc\\u06ff\\u0710-\\u074a\\u074d-\\u07b1\\u07c0-\\u07f5\\u07fa\\u0800-\\u082d\\u0840-\\u085b\\u08a0-\\u08b4\\u08e3-\\u0963\\u0966-\\u096f\\u0971-\\u0983\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bc-\\u09c4\\u09c7\\u09c8\\u09cb-\\u09ce\\u09d7\\u09dc\\u09dd\\u09df-\\u09e3\\u09e6-\\u09f1\\u0a01-\\u0a03\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a59-\\u0a5c\\u0a5e\\u0a66-\\u0a75\\u0a81-\\u0a83\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abc-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ad0\\u0ae0-\\u0ae3\\u0ae6-\\u0aef\\u0af9\\u0b01-\\u0b03\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3c-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b56\\u0b57\\u0b5c\\u0b5d\\u0b5f-\\u0b63\\u0b66-\\u0b6f\\u0b71\\u0b82\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd0\\u0bd7\\u0be6-\\u0bef\\u0c00-\\u0c03\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c39\\u0c3d-\\u0c44\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c58-\\u0c5a\\u0c60-\\u0c63\\u0c66-\\u0c6f\\u0c81-\\u0c83\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbc-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0cde\\u0ce0-\\u0ce3\\u0ce6-\\u0cef\\u0cf1\\u0cf2\\u0d01-\\u0d03\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d-\\u0d44\\u0d46-\\u0d48\\u0d4a-\\u0d4e\\u0d57\\u0d5f-\\u0d63\\u0d66-\\u0d6f\\u0d7a-\\u0d7f\\u0d82\\u0d83\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0de6-\\u0def\\u0df2\\u0df3\\u0e01-\\u0e3a\\u0e40-\\u0e4e\\u0e50-\\u0e59\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb9\\u0ebb-\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0ec8-\\u0ecd\\u0ed0-\\u0ed9\\u0edc-\\u0edf\\u0f00\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f3e-\\u0f47\\u0f49-\\u0f6c\\u0f71-\\u0f84\\u0f86-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u1000-\\u1049\\u1050-\\u109d\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u135d-\\u135f\\u1369-\\u1371\\u1380-\\u138f\\u13a0-\\u13f5\\u13f8-\\u13fd\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f8\\u1700-\\u170c\\u170e-\\u1714\\u1720-\\u1734\\u1740-\\u1753\\u1760-\\u176c\\u176e-\\u1770\\u1772\\u1773\\u1780-\\u17d3\\u17d7\\u17dc\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u1810-\\u1819\\u1820-\\u1877\\u1880-\\u18aa\\u18b0-\\u18f5\\u1900-\\u191e\\u1920-\\u192b\\u1930-\\u193b\\u1946-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19b0-\\u19c9\\u19d0-\\u19da\\u1a00-\\u1a1b\\u1a20-\\u1a5e\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1aa7\\u1ab0-\\u1abd\\u1b00-\\u1b4b\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1b80-\\u1bf3\\u1c00-\\u1c37\\u1c40-\\u1c49\\u1c4d-\\u1c7d\\u1cd0-\\u1cd2\\u1cd4-\\u1cf6\\u1cf8\\u1cf9\\u1d00-\\u1df5\\u1dfc-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u200c\\u200d\\u203f\\u2040\\u2054\\u2071\\u207f\\u2090-\\u209c\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2118-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d7f-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u2de0-\\u2dff\\u3005-\\u3007\\u3021-\\u302f\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u3099-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fd5\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua62b\\ua640-\\ua66f\\ua674-\\ua67d\\ua67f-\\ua6f1\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua7ad\\ua7b0-\\ua7b7\\ua7f7-\\ua827\\ua840-\\ua873\\ua880-\\ua8c4\\ua8d0-\\ua8d9\\ua8e0-\\ua8f7\\ua8fb\\ua8fd\\ua900-\\ua92d\\ua930-\\ua953\\ua960-\\ua97c\\ua980-\\ua9c0\\ua9cf-\\ua9d9\\ua9e0-\\ua9fe\\uaa00-\\uaa36\\uaa40-\\uaa4d\\uaa50-\\uaa59\\uaa60-\\uaa76\\uaa7a-\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaef\\uaaf2-\\uaaf6\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uab30-\\uab5a\\uab5c-\\uab65\\uab70-\\uabea\\uabec\\uabed\\uabf0-\\uabf9\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe00-\\ufe0f\\ufe20-\\ufe2f\\ufe33\\ufe34\\ufe4d-\\ufe4f\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff10-\\uff19\\uff21-\\uff3a\\uff3f\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc]|\\ud800[\\udc00-\\udc0b\\udc0d-\\udc26\\udc28-\\udc3a\\udc3c\\udc3d\\udc3f-\\udc4d\\udc50-\\udc5d\\udc80-\\udcfa\\udd40-\\udd74\\uddfd\\ude80-\\ude9c\\udea0-\\uded0\\udee0\\udf00-\\udf1f\\udf30-\\udf4a\\udf50-\\udf7a\\udf80-\\udf9d\\udfa0-\\udfc3\\udfc8-\\udfcf\\udfd1-\\udfd5]|\\ud801[\\udc00-\\udc9d\\udca0-\\udca9\\udd00-\\udd27\\udd30-\\udd63\\ude00-\\udf36\\udf40-\\udf55\\udf60-\\udf67]|\\ud802[\\udc00-\\udc05\\udc08\\udc0a-\\udc35\\udc37\\udc38\\udc3c\\udc3f-\\udc55\\udc60-\\udc76\\udc80-\\udc9e\\udce0-\\udcf2\\udcf4\\udcf5\\udd00-\\udd15\\udd20-\\udd39\\udd80-\\uddb7\\uddbe\\uddbf\\ude00-\\ude03\\ude05\\ude06\\ude0c-\\ude13\\ude15-\\ude17\\ude19-\\ude33\\ude38-\\ude3a\\ude3f\\ude60-\\ude7c\\ude80-\\ude9c\\udec0-\\udec7\\udec9-\\udee6\\udf00-\\udf35\\udf40-\\udf55\\udf60-\\udf72\\udf80-\\udf91]|\\ud803[\\udc00-\\udc48\\udc80-\\udcb2\\udcc0-\\udcf2]|\\ud804[\\udc00-\\udc46\\udc66-\\udc6f\\udc7f-\\udcba\\udcd0-\\udce8\\udcf0-\\udcf9\\udd00-\\udd34\\udd36-\\udd3f\\udd50-\\udd73\\udd76\\udd80-\\uddc4\\uddca-\\uddcc\\uddd0-\\uddda\\udddc\\ude00-\\ude11\\ude13-\\ude37\\ude80-\\ude86\\ude88\\ude8a-\\ude8d\\ude8f-\\ude9d\\ude9f-\\udea8\\udeb0-\\udeea\\udef0-\\udef9\\udf00-\\udf03\\udf05-\\udf0c\\udf0f\\udf10\\udf13-\\udf28\\udf2a-\\udf30\\udf32\\udf33\\udf35-\\udf39\\udf3c-\\udf44\\udf47\\udf48\\udf4b-\\udf4d\\udf50\\udf57\\udf5d-\\udf63\\udf66-\\udf6c\\udf70-\\udf74]|\\ud805[\\udc80-\\udcc5\\udcc7\\udcd0-\\udcd9\\udd80-\\uddb5\\uddb8-\\uddc0\\uddd8-\\udddd\\ude00-\\ude40\\ude44\\ude50-\\ude59\\ude80-\\udeb7\\udec0-\\udec9\\udf00-\\udf19\\udf1d-\\udf2b\\udf30-\\udf39]|\\ud806[\\udca0-\\udce9\\udcff\\udec0-\\udef8]|\\ud808[\\udc00-\\udf99]|\\ud809[\\udc00-\\udc6e\\udc80-\\udd43]|[\\ud80c\\ud840-\\ud868\\ud86a-\\ud86c\\ud86f-\\ud872][\\udc00-\\udfff]|\\ud80d[\\udc00-\\udc2e]|\\ud811[\\udc00-\\ude46]|\\ud81a[\\udc00-\\ude38\\ude40-\\ude5e\\ude60-\\ude69\\uded0-\\udeed\\udef0-\\udef4\\udf00-\\udf36\\udf40-\\udf43\\udf50-\\udf59\\udf63-\\udf77\\udf7d-\\udf8f]|\\ud81b[\\udf00-\\udf44\\udf50-\\udf7e\\udf8f-\\udf9f]|\\ud82c[\\udc00\\udc01]|\\ud82f[\\udc00-\\udc6a\\udc70-\\udc7c\\udc80-\\udc88\\udc90-\\udc99\\udc9d\\udc9e]|\\ud834[\\udd65-\\udd69\\udd6d-\\udd72\\udd7b-\\udd82\\udd85-\\udd8b\\uddaa-\\uddad\\ude42-\\ude44]|\\ud835[\\udc00-\\udc54\\udc56-\\udc9c\\udc9e\\udc9f\\udca2\\udca5\\udca6\\udca9-\\udcac\\udcae-\\udcb9\\udcbb\\udcbd-\\udcc3\\udcc5-\\udd05\\udd07-\\udd0a\\udd0d-\\udd14\\udd16-\\udd1c\\udd1e-\\udd39\\udd3b-\\udd3e\\udd40-\\udd44\\udd46\\udd4a-\\udd50\\udd52-\\udea5\\udea8-\\udec0\\udec2-\\udeda\\udedc-\\udefa\\udefc-\\udf14\\udf16-\\udf34\\udf36-\\udf4e\\udf50-\\udf6e\\udf70-\\udf88\\udf8a-\\udfa8\\udfaa-\\udfc2\\udfc4-\\udfcb\\udfce-\\udfff]|\\ud836[\\ude00-\\ude36\\ude3b-\\ude6c\\ude75\\ude84\\ude9b-\\ude9f\\udea1-\\udeaf]|\\ud83a[\\udc00-\\udcc4\\udcd0-\\udcd6]|\\ud83b[\\ude00-\\ude03\\ude05-\\ude1f\\ude21\\ude22\\ude24\\ude27\\ude29-\\ude32\\ude34-\\ude37\\ude39\\ude3b\\ude42\\ude47\\ude49\\ude4b\\ude4d-\\ude4f\\ude51\\ude52\\ude54\\ude57\\ude59\\ude5b\\ude5d\\ude5f\\ude61\\ude62\\ude64\\ude67-\\ude6a\\ude6c-\\ude72\\ude74-\\ude77\\ude79-\\ude7c\\ude7e\\ude80-\\ude89\\ude8b-\\ude9b\\udea1-\\udea3\\udea5-\\udea9\\udeab-\\udebb]|\\ud869[\\udc00-\\uded6\\udf00-\\udfff]|\\ud86d[\\udc00-\\udf34\\udf40-\\udfff]|\\ud86e[\\udc00-\\udc1d\\udc20-\\udfff]|\\ud873[\\udc00-\\udea1]|\\ud87e[\\udc00-\\ude1d]|\\udb40[\\udd00-\\uddef])*|\\\\u(?:[\\dA-Fa-f]{4}|\\{[\\dA-Fa-f]+\\}))*';
Lexer.SPACES = '\u0009\u000A\u000B\u000C\u000D\u0020\u0085\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF';
Lexer.NUMBERS = '(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|(?:(\\.\\d+)|(?!0[xobXOB])[\\d]+(?:\\.(?!\\w)|\\.(?=[\\d])\\d*)?)(?:[eE][+-]?\\d+)?)';

module.exports = Lexer;
