declare namespace Jymfony.Component.Autoloader.Parser {
    type Token = {
        value: string,
        type: number,
        position: number,
        index: number,
    };

    /**
     * Lexer for js code.
     * Based upon the Lexer component, part of its code is duplicated here
     * as it is fundamental part of the class loader/compiler.
     */
    export class Lexer {
        public static readonly T_SPACE = 0;
        public static readonly T_STRING = 1;
        public static readonly T_DOCBLOCK = 2;
        public static readonly T_COMMENT = 3;
        public static readonly T_OPEN_PARENTHESIS = 4;
        public static readonly T_CLOSED_PARENTHESIS = 5;
        public static readonly T_CURLY_BRACKET_OPEN = 6;
        public static readonly T_CURLY_BRACKET_CLOSE = 7;
        public static readonly T_DOT = 8;
        public static readonly T_OPEN_SQUARE_BRACKET = 9;
        public static readonly T_CLOSED_SQUARE_BRACKET = 10;
        public static readonly T_CLASS = 11;
        public static readonly T_EXTENDS = 12;
        public static readonly T_KEYWORD = 13;
        public static readonly T_IDENTIFIER = 14;
        public static readonly T_SEMICOLON = 15;
        public static readonly T_ASSIGNMENT_OP = 16;
        public static readonly T_COMPARISON_OP = 17;
        public static readonly T_COMMA = 18;
        public static readonly T_OPERATOR = 19;
        public static readonly T_NUMBER = 20;
        public static readonly T_COLON = 21;
        public static readonly T_FUNCTION = 22;
        public static readonly T_REGEX = 23;
        public static readonly T_DECORATOR = 24;
        public static readonly T_DECORATOR_IDENTIFIER = 25;
        public static readonly T_GET = 26;
        public static readonly T_SET = 27;
        public static readonly T_STATIC = 28;
        public static readonly T_ASYNC = 29;
        public static readonly T_ARROW = 30;
        public static readonly T_QUESTION_MARK = 31;
        public static readonly T_TRUE = 32;
        public static readonly T_FALSE = 33;
        public static readonly T_THROW = 34;
        public static readonly T_NEW = 35;
        public static readonly T_LOGICAL_OPERATOR = 36;
        public static readonly T_IF = 37;
        public static readonly T_ELSE = 38;
        public static readonly T_RETURN = 39;
        public static readonly T_AWAIT = 40;
        public static readonly T_THIS = 41;
        public static readonly T_SUPER = 42;
        public static readonly T_NULL = 43;
        public static readonly T_SPREAD = 44;
        public static readonly T_YIELD = 45;
        public static readonly T_ARGUMENTS = 46;
        public static readonly T_OTHER = 255;
        public static readonly T_EOF = 256;

        public static readonly RESERVED_WORDS: string;
        public static readonly IDENTIFIER: string;
        public static readonly SPACES: string;
        public static readonly NUMBERS: string;

        public token: Token;
        public lookahead: Token;

        /**
         * The input data to be tokenized.
         *
         * On set, the Lexer is immediately reset and the new input tokenized.
         * Any unprocessed tokens from any previous input are lost.
         */
        public input: string;

        private _input: string;
        private _peek: number;
        private _position: number;
        private _spaces: RegExp;
        private _reservedKeywords: RegExp;
        private _identifiers: RegExp;
        private _numbers: RegExp;
        private _last: any;
        private _tokens: Token[];

        /**
         * Constructor.
         */
        constructor();

        /**
         * Reset the lexer
         */
        reset(): void;

        /**
         * Resets the peek pointer to 0.
         */
        resetPeek(): void;

        /**
         * Resets the lexer position on the input to the given position.
         *
         * @param position Position to place the lexical scanner.
         */
        resetPosition(position?: number): void;

        /**
         * Retrieve the original lexer's input until a given position.
         */
        getInputUntilPosition(position: number): string;

        /**
         * Checks whether a given token matches the current lookahead.
         */
        isNextToken(token: number|string): boolean;

        /**
         * Checks whether any of the given tokens matches the current lookahead.
         */
        isNextTokenAny(tokens: number[]): boolean;

        /**
         * Moves to the next token in the input string.
         */
        moveNext(): boolean;

        /**
         * Tells the lexer to skip input tokens until it sees a token with the given value.
         *
         * @param type The token type to skip until.
         */
        skipUntil(type: string): void;

        /**
         * Checks if given value is identical to the given token.
         */
        isA(value: any, token: number): boolean;

        /**
         * Moves the lookahead token forward.
         *
         * @returns The next token or undefined if there are no more tokens ahead.
         */
        peek(): Token|undefined;

        /**
         * Peeks at the next token, returns it and immediately resets the peek.
         *
         * @returns The next token or undefined if there are no more tokens ahead.
         */
        glimpse(): Token|undefined;

        /**
         * Gets the literal for a given token.
         */
        getLiteral(token: number): string;

        /**
         * Scans the input string for tokens.
         */
        private _scan(input: string): void;

        /**
         * Iterates through the tokens
         */
        [Symbol.iterator](): IterableIterator<Token>;

        getPatterns(): string[];
        getType(holder: ValueHolder): number;
    }
}
