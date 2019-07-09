declare namespace Jymfony.Component.Console.Input {
    /**
     * ArrayInput represents an input provided as an array.
     *
     * Usage:
     *
     *     input = new ArrayInput(['name' => 'foo', '--bar' => 'foobar']);
     */
    export class ArrayInput extends Input {
        private _parameters: Record<string, string>;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(parameters: Record<string, string>, definition?: InputDefinition): void;
        constructor(parameters: Record<string, string>, definition?: InputDefinition);

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
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        parse(): void;

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
         * Adds a long option value.
         *
         * @param name The long option key
         * @param value The value for the option
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When option given doesn't exist
         * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When a required value is missing
         */
        private _addLongOption(name: string, value: any): void;

        /**
         * Adds an argument value.
         *
         * @param name The argument name
         * @param value The value for the argument
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When argument given doesn't exist
         */
        private _addArgument(name: string, value: any): void;
    }
}
