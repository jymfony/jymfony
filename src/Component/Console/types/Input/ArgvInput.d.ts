declare namespace Jymfony.Component.Console.Input {
    /**
     * ArgvInput represents an input coming from the CLI arguments.
     *
     * Usage:
     *
     *     input = new ArgvInput();
     *
     * By default, the `process.argv` array is used for the input values.
     *
     * This can be overridden by explicitly passing the input values in the constructor:
     *
     *     input = new ArgvInput(process.argv);
     *
     * If you pass it yourself, don't forget that the first element of the array
     * is the name of the running application.
     *
     * When passing an argument to the constructor, be sure that it respects
     * the same rules as the argv one. It's almost always better to use the
     * `StringInput` when you want to provide your own input.
     *
     * @see http://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html
     * @see http://www.opengroup.org/onlinepubs/009695399/basedefs/xbd_chap12.html#tag_12_02
     */
    class ArgvInput extends Input {
        private _tokens: string[];
        private _parsed: string[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(argv?: string[], definition?: InputDefinition): void;
        constructor(argv?: string[], definition?: InputDefinition);

        /**
         * @inheritdoc
         */
        parse(): void;

        /**
         * @inheritdoc
         */
        public readonly firstArgument: string|undefined;

        /**
         * @inheritdoc
         */
        hasParameterOption(values: string|string[], onlyParams?: boolean): boolean;

        /**
         * @inheritdoc
         */
        getParameterOption(values: string|string[], defaultValue?: any, onlyParams?: boolean): any;

        /**
         * Returns a stringified representation of the args passed to the command.
         */
        toString(): string;

        /**
         * Parses an argument.
         *
         * @throws {Jymfony.Component.Console.Exception.RuntimeException} When too many arguments are given
         */
        private _parseArgument(token: string): void;

        /**
         * Parses a long option.
         *
         * @param {string} token
         *
         * @private
         */
        private _parseLongOption(token: string): void;

        /**
         * Adds a long option value.
         *
         * @param name The long option key
         * @param value The value for the option
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When option given doesn't exist
         */
        private _addLongOption(name: string, value: any): void;

        /**
         * Parses a short option.
         *
         * @param {string} token The current token
         *
         * @private
         */
        private _parseShortOption(token: string): void;

        /**
         * Adds a short option value.
         *
         * @param shortcut The short option key
         * @param value The value for the option
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When option given doesn't exist
         */
        private _addShortOption(shortcut: string, value: any): void;

        /**
         * Parses a short option set.
         *
         * @param name The current token
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When option given doesn't exist
         */
        private _parseShortOptionSet(name: string): void;
    }
}
