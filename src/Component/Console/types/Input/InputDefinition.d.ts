declare namespace Jymfony.Component.Console.Input {
    export class InputDefinition {
        private _arguments: Record<string, InputArgument>;
        private _options: Record<string, InputOption>;
        private _requiredCount: number;
        private _hasOptional: boolean;
        private _hasAnArrayArgument: boolean;
        private _shortcuts: Record<string, string>;

        /**
         * Constructor.
         */
        __construct(definition: (InputArgument | InputOption)[]): void;
        constructor(definition: (InputArgument | InputOption)[]);

        /**
         * Sets the input definition.
         */
        setDefinition(definition: (InputArgument | InputOption)[]): void;

        /**
         * Sets arguments for this definition.
         */
        setArguments(args?: InputArgument[] | undefined): void;

        /**
         * Adds arguments to the definition.
         */
        addArguments(args: InputArgument[]): this;

        /**
         * Adds an argument.
         */
        addArgument(argument: InputArgument): this;

        /**
         * Gets an argument by name or index.
         */
        getArgument(name: string|number): InputArgument;

        /**
         * Returns true if an argument exists.
         */
        hasArgument(name: string|number): boolean;

        /**
         * Gets the InputArgument array.
         */
        getArguments(): InputArgument[];

        /**
         * Returns the number of required arguments.
         */
        getArgumentCount(): number;

        /**
         * Gets the arguments default values.
         */
        getArgumentDefaults(): Record<string, any>;

        /**
         * Sets options for the definition
         */
        setOptions(options: InputOption[]): void;

        /**
         * Add input options.
         */
        addOptions(options: InputOption[]): this;

        /**
         * Adds an option.
         */
        addOption(option: InputOption): this;

        /**
         * Returns an input option by name.
         */
        getOption(name: string): InputOption;

        /**
         * Checks if an option exists.
         */
        hasOption(name: string): boolean;

        /**
         * Gets the array of options.
         */
        getOptions(): InputOption[];

        /**
         * Checks if a shortcut has been defined.
         */
        hasShortcut(shortcut: string): boolean;

        /**
         * Gets the option for shortcut.
         */
        getOptionForShortcut(shortcut: string): InputOption;

        /**
         * Get default option values.
         */
        getOptionDefaults(): Record<string, any>;

        /**
         * Gets the synopsis.
         *
         * @param [short = false] Whether to return the short version
         */
        getSynopsis(short?: boolean): string;
    }
}
