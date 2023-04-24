declare namespace Jymfony.Component.Console.Input {
    /**
     * StringInput represents an input provided as a string.
     *
     * Usage:
     *
     *     const input = new StringInput('foo --bar="foobar"');
     */
    export class StringInput extends ArgvInput {
        /**
         * Constructor.
         *
         * @param input A string representing the parameters from the CLI
         */
        // @ts-ignore
        __construct(input: string): void;

        constructor(input: string);

        /**
         * Tokenizes a string.
         *
         * @throws {InvalidArgumentException} When unable to parse input (should never happen)
         */
        private _tokenize(input: string): string[];
    }
}
