declare namespace Jymfony.Component.Console {
    import Command = Jymfony.Component.Console.Command.Command;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class Application {
        /**
         * Sets if application should automatically terminate when run
         * has been completed.
         */
        public /* writeonly */ autoExit: boolean;

        /**
         * Sets whether to catch exceptions while running or not.
         */
        public /* writeonly */ catchExceptions: boolean;

        /**
         * Sets the default Command name.
         */
        public /* writeonly */ defaultCommand: string;

        /**
         * Input definition to be used with this application.
         */
        public definition: InputDefinition;

        /**
         * Sets the event dispatcher.
         */
        public /* writeonly */ dispatcher: EventDispatcherInterface;

        /**
         * The help message.
         */
        public readonly help: string;

        /**
         * Gets/sets the name of the application.
         *
         * @returns {string} The application name
         */
        public name: string;

        /**
         * Returns an array of all unique namespaces used by currently registered commands.
         *
         * It does not return the global namespace which always exists.
         */
        public readonly namespaces: string[];

        /**
         * Gets/sets the application version.
         *
         * @returns {string} The application version
         */
        public version: string;

        private _name: string;
        private _version: string;
        private _eventDispatcher?: EventDispatcherInterface;
        private _defaultCommand: string;
        private _definition: InputDefinition;
        private _commands: Record<string, Command>;
        private _terminal: Terminal;
        private _catchExceptions: boolean;
        private _autoExit: boolean;
        private _runningCommand?: Command;
        private _wantHelps: boolean;

        /**
         * Constructor.
         */
        __construct(name?: string, version?: string): void;
        constructor(name?: string, version?: string);

        /**
         * Run the application
         */
        run(input?: InputInterface, output?: OutputInterface): Promise<number>;

        /**
         * Shuts down the application.
         */
        shutdown(exitCode: number): void;

        /**
         * Returns the long version of the application.
         */
        getLongVersion(): string;

        /**
         * Registers a new command.
         */
        register(name: string): Command;

        /**
         * Adds an array of command objects.
         *
         * If a Command is not enabled it will not be added.
         */
        addCommands(commands: Command[]): void;

        /**
         * Adds a command object.
         *
         * If a command with the same name already exists, it will be overridden.
         * If the command is not enabled it will not be added.
         */
        add(command: Command): Command|undefined;

        /**
         * Returns a registered command by name or alias.
         *
         * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException} When command name given does not exist
         */
        get(name: string): Command;

        /**
         * Returns true if the command exists, false otherwise.
         */
        has(name: string): boolean;

        /**
         * Finds a command by name or alias.
         *
         * Contrary to get, this command tries to find the best
         * match if you give it an abbreviation of a name or alias.
         *
         * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException} When command name is incorrect or ambiguous
         */
        find(name: string): Command;

        /**
         * Gets the commands (registered in the given namespace if provided).
         * The object keys are the full names and the values the command instances.
         */
        all(namespace?: string|undefined): Record<string, Command>;

        /**
         * Finds a registered namespace by a name or an abbreviation.
         *
         * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException} When namespace is incorrect or ambiguous
         */
        findNamespace(namespace: string): string;

        /**
         * Returns the namespace part of the command name.
         *
         * This method is not part of public API and should not be used directly.
         */
        extractNamespace(name: string, limit?: number|undefined): string;

        /**
         * Runs the current application.
         *
         * @returns 0 if everything went fine, or an error code
         */
        protected _doRun(input: InputInterface, output: OutputInterface): Promise<number>;

        /**
         * Configures the input and output instances based on the user arguments and options.
         */
        protected _configureIO(input: InputInterface, output: OutputInterface): void;

        /**
         * Gets the default input definition.
         */
        protected _getDefaultInputDefinition(): InputDefinition;

        /**
         * Gets the built-in commands.
         */
        protected _getDefaultCommands(): Command[];

        /**
         * Gets the name of the command.
         */
        protected _getCommandName(input: InputInterface): string;

        /**
         * Renders a catched exception.
         */
        protected _renderException(exception: Error, output: OutputInterface): void;

        /**
         * Runs the current command.
         *
         * If an event dispatcher has been attached to the application,
         * events are also dispatched during the life-cycle of the command.
         *
         * @returns 0 if everything went fine, or an error code
         *
         * @throws {Exception} when the command being run threw an exception
         */
        private _doRunCommand(command: Command, input: InputInterface, output: OutputInterface): Promise<number>;

        /**
         * Finds alternative of name among collection,
         * if nothing is found in collection, try in abbrevs.
         */
        private _findAlternatives(name: string, collection: string[]): string[];

        /**
         * Returns abbreviated suggestions in string format.
         */
        private _getAbbreviationSuggestions(abbrevs: string[]): string;

        /**
         * Returns all namespaces of the command name.
         */
        private _extractAllNamespaces(name: string): string[];

        private _splitStringByWidth(line: string, number: number): IterableIterator<string>;
    }
}
