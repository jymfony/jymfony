declare namespace Jymfony.Component.Console.Input {
    import ContractsInputInterface = Jymfony.Contracts.Console.InputInterface;

    export class InputInterface extends ContractsInputInterface {
        public static readonly definition: Newable<InputInterface>;

        /**
         * The first argument from the raw parameters (not parsed).
         */
        public readonly firstArgument: string|undefined;

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
    }
}
