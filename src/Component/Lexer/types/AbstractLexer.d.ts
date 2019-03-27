declare namespace Jymfony.Component.Lexer {
    interface Token {
        value: any,
        type: number | string,
        position: number,
    }

    export abstract class AbstractLexer implements Iterable<Token> {
        public token: Token | undefined;
        public lookahead: Token | undefined;
        private _peek?: number;
        private _position?: number;
        private _input?: string;
        private _tokens: Token[];

        __construct(): void;
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
         * @param [position = 0] Position to place the lexical scanner.
         */
        resetPosition(position?: number): void;

        /**
         * Retrieve the original lexer's input until a given position.
         */
        getInputUntilPosition(position: number): string;

        /**
         * Checks whether a given token matches the current lookahead.
         */
        isNextToken(token: number | string): boolean;

        /**
         * Checks whether any of the given tokens matches the current lookahead.
         */
        isNextTokenAny(tokens: (number | string)[]): boolean;

        /**
         * Moves to the next token in the input string.
         *
         * @returns {boolean}
         */
        moveNext(): boolean;

        /**
         * Tells the lexer to skip input tokens until it sees a token with the given value.
         *
         * @param type The token type to skip until.
         */
        skipUntil(type: number | string): void;

        /**
         * Checks if given value is identical to the given token.
         */
        isA(value: any, token: number | string): boolean;

        /**
         * Moves the lookahead token forward.
         *
         * @returns The next token or undefined if there are no more tokens ahead.
         */
        peek(): Token | undefined;

        /**
         * Peeks at the next token, returns it and immediately resets the peek.
         *
         * @returns The next token or undefined if there are no more tokens ahead.
         */
        glimpse(): Token | undefined;

        /**
         * Gets the literal for a given token.
         */
        getLiteral(token: number | string): string;

        /**
         * The original input data.
         *
         * When setting, the Lexer is immediately reset and the new input tokenized.
         * Any unprocessed tokens from any previous input are lost.
         */
        public input: string;

        /**
         * Scans the input string for tokens.
         *
         * @param {string} input A query string.
         */
        private _scan(input: string): void;

        /**
         * Iterates through the tokens
         */
        [Symbol.iterator](): IterableIterator<Token>;

        /**
         * Regex modifiers.
         */
        protected getModifiers(): string;

        /**
         * Lexical catchable patterns.
         */
        protected abstract getCatchablePatterns(): string[];

        /**
         * Lexical non-catchable patterns.
         */
        protected abstract getNonCatchablePatterns(): string[];

        /**
         * Retrieve token type. Also processes the token value if necessary.
         */
        protected abstract getType(holder: ValueHolder): string | number;
    }
}
