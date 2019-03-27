declare namespace Jymfony.Component.Console.Command {
    import InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
    import InputArgument = Jymfony.Component.Console.Input.InputArgument;
    import InputOption = Jymfony.Component.Console.Input.InputOption;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;

    /**
     * Base class for all commands.
     */
    export class Command {
        /**
         * The aliases for the command.
         */
        public aliases: string[];

        /**
         * Gets/sets the application instance for this command.
         */
        public application: Application;

        /**
         * Sets the code to execute when running this command.
         *
         * If this method is used, it overrides the code defined
         * in the execute() method.
         */
        public /* writeonly */ code: Invokable;

        /**
         * Gets/sets an array of argument and option instances.
         */
        public definition: InputDefinition | (InputArgument | InputOption)[];

        /**
         * The description for the command.
         */
        public description: string;

        /**
         * The help for the command
         */
        public help: string;

        /**
         * Whether or not the command should be hidden from the list of commands.
         */
        public hidden: boolean;

        /**
         * Gets/sets the name of the command.
         *
         * Can set both the namespace and the name if you separate them by a colon (:)
         *
         *     command.name = 'foo:bar';
         */
        public name: string;

        /**
         * Gets the InputDefinition to be used to create representations of this Command.
         *
         * Can be overridden to provide the original command representation when it would otherwise
         * be changed by merging with the application InputDefinition.
         *
         * This method is not part of public API and should not be used directly.
         */
        public readonly nativeDefinition: InputDefinition;

        /**
         * Sets the process title of the command.
         *
         * This feature should be used only when creating a long process command,
         * like a daemon.
         */
        public /* writeonly */ processTitle: string;

        /**
         * The processed help for the command replacing the %command.name% and
         * %command.full_name% patterns with the real values dynamically.
         */
        public readonly processedHelp: string;

        /**
         * Alternative usages of the command.
         */
        public readonly usages: string[];

        private _name: string|undefined;
        private _synopsis: { short?: string, long?: string };
        private _aliases: string[];
        private _usages: string[];
        private _ignoreValidationError: boolean;
        private _definition: InputDefinition;
        private _help: string;
        private _description: string;
        private _hidden: boolean;
        private _applicationDefinitionMerged: boolean;
        private _applicationDefinitionMergedWithArgs: boolean;
        private _code: undefined|Invokable;
        private _processTitle: undefined|string;
        private _application: Application;

        /**
         * Constructor.
         */
        __construct(name?: string|undefined): void;

        /**
         * Ignores validation errors.
         *
         * This is mainly useful for the help command.
         */
        ignoreValidationError(): void;

        /**
         * Checks whether the command is enabled or not in the current environment.
         *
         * Override this return false if the command can not
         * run properly under the current conditions.
         */
        isEnabled(): boolean;

        /**
         * Configures the current command.
         */
        configure(): void;

        /**
         * Executes the current command.
         * You need to override this method. Defining it as a generator
         * you can yield a Promise and waiting asynchronously for its
         * completion, retrieving its value and surrounding it with a
         * try...catch block in case of rejection
         *
         * @returns undefined or 0 if everything went fine, or an error code
         *
         * @throws {Jymfony.Component.Console.Exception.LogicException.LogicException} When this abstract method is not implemented
         */
        execute(input: InputInterface, output: OutputInterface): Promise<void> | Promise<number> | Promise<void | number> | number | void;

        /**
         * Interacts with the user.
         *
         * This method is executed before the InputDefinition is validated.
         * This means that this is the only place where the command can
         * interactively ask for values of missing required arguments.
         */
        interact(input: InputInterface, output: OutputInterface): Promise<void> | void;

        /**
         * Initializes the command just after the input has been validated.
         *
         * This is mainly useful when a lot of commands extends one main command
         * where some things need to be initialized based on the input arguments and options.
         */
        interact(input: InputInterface, output: OutputInterface): Promise<void> | void;

        /**
         * Runs the command.
         *
         * The code to execute is either defined by overriding the execute() method
         * in a sub-class.
         *
         * @returns The command exit code
         *
         * @see execute()
         */
        run(input: InputInterface, output: OutputInterface): Promise<number>;

        /**
         * Merges the application definition with the command definition.
         *
         * This method is not part of public API and should not be used directly.
         *
         * @param mergeArgs Whether to merge or not the Application definition arguments to Command definition arguments
         */
        mergeApplicationDefinition(mergeArgs?: boolean): void;

        /**
         * Adds an argument.
         *
         * @param name The argument name
         * @param [mode] The argument mode: InputArgument.REQUIRED or InputArgument.OPTIONAL
         * @param [description = ''] A description text
         * @param [defaultValue] The default value (for InputArgument::OPTIONAL mode only)
         *
         * @returns The current instance
         */
        addArgument(name: string, mode?: number, description?: string, defaultValue?: any): this;

        /**
         * Adds an option.
         *
         * @param name The option name
         * @param [shortcut] The shortcut (can be null)
         * @param [mode] The option mode: One of the InputOption.VALUE_* constants
         * @param [description = ''] A description text
         * @param [defaultValue] The default value (must be undefined for InputOption.VALUE_NONE)
         *
         * @returns The current instance
         */
        addOption(name: string, shortcut?: string|undefined, mode?: number, description?: string, defaultValue?: any): this;

        /**
         * Returns the synopsis for the command.
         *
         * @param [short = false] Whether to show the short version of the synopsis (with options folded) or not
         */
        getSynopsis(short?: boolean): string;

        /**
         * Add a command usage example.
         *
         * @param usage The usage, it'll be prefixed with the command name
         */
        addUsage(usage: string): this;

        /**
         * Validates a command name.
         * It must be non-empty and parts can optionally be separated by ":".
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When the name is invalid
         */
        private _validateName(name: string): void;
    }
}
