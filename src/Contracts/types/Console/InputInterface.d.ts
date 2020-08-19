declare namespace Jymfony.Contracts.Console {
    export class InputInterface {
        public static readonly definition: Newable<InputInterface>;

        /**
         * Returns all the given arguments merged with the default values.
         */
        public readonly arguments: Record<string, any>;

        /**
         * Gets/sets the input interactivity.
         */
        public interactive: boolean;

        /**
         * Returns all the given options merged with the default values.
         */
        public readonly options: Record<string, any>;

        /**
         * Returns the argument value for a given argument name.
         *
         * @throws {InvalidArgumentException} When argument given doesn't exist
         */
        getArgument(name: string): any;

        /**
         * Sets an argument value by name.
         *
         * @throws {InvalidArgumentException} When argument given doesn't exist
         */
        setArgument(name: string, value: string): void;

        /**
         * Returns true if an InputArgument object exists by name or position.
         */
        hasArgument(name: string|number): boolean;

        /**
         * Returns the option value for a given option name.
         *
         * @throws {InvalidArgumentException} When option given doesn't exist
         */
        getOption(name: string): any;

        /**
         * Sets an option value by name.
         *
         * @throws {InvalidArgumentException} When option given doesn't exist
         */
        setOption(name: string, value: any): void;

        /**
         * Returns true if an InputOption object exists by name.
         */
        hasOption(name: string): boolean;
    }
}
