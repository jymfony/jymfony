declare namespace Jymfony.Component.Console.Input {
    export class InputInterface implements MixinInterface {
        public static readonly definition: Newable<InputInterface>;

        /**
         * Returns all the given arguments merged with the default values.
         */
        public readonly arguments: Record<string, any>;

        /**
         * The first argument from the raw parameters (not parsed).
         */
        public readonly firstArgument: string|undefined;

        /**
         * Gets/sets the input interactivity.
         */
        public interactive: boolean;

        /**
         * Returns all the given options merged with the default values.
         */
        public readonly options: Record<string, any>;

        /**
         * Returns true if the raw parameters (not parsed) contain a value.
         *
         * This method is to be used to introspect the input parameters
         * before they have been validated. It must be used carefully.
         *
         * @param values The values to look for in the raw parameters (can be an array)
         * @param [onlyParams = false] Only check real parameters, skip those following an end of options (--) signal
         *
         * @returns true if the value is contained in the raw parameters
         */
        hasParameterOption(values: string|string[], onlyParams?: boolean): boolean;

        /**
         * Returns the value of a raw option (not parsed).
         *
         * This method is to be used to introspect the input parameters
         * before they have been validated. It must be used carefully.
         *
         * @param values The value(s) to look for in the raw parameters (can be an array)
         * @param [defaultValue = false] The default value to return if no result is found
         * @param [onlyParams = false] Only check real parameters, skip those following an end of options (--) signal
         *
         * @returns The option value
         */
        getParameterOption(values: string|string[], defaultValue?: any, onlyParams?: boolean): any;

        /**
         * Binds the current Input instance with the given arguments and options.
         */
        bind(definition: InputDefinition): void;

        /**
         * Validates the input.
         *
         * @throws {Jymfony.Component.Console.Exception.RuntimeException} When not enough arguments are given
         */
        validate(): void;

        /**
         * Returns the argument value for a given argument name.
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When argument given doesn't exist
         */
        getArgument(name: string): any;

        /**
         * Sets an argument value by name.
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When argument given doesn't exist
         */
        setArgument(name: string, value: string): void;

        /**
         * Returns true if an InputArgument object exists by name or position.
         */
        hasArgument(name: string|number): boolean;

        /**
         * Returns the option value for a given option name.
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When option given doesn't exist
         */
        getOption(name: string): any;

        /**
         * Sets an option value by name.
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When option given doesn't exist
         */
        setOption(name: string, value: any): void;

        /**
         * Returns true if an InputOption object exists by name.
         */
        hasOption(name: string): boolean;
    }
}
