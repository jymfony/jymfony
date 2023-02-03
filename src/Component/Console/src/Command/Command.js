const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;
const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const LogicException = Jymfony.Component.Console.Exception.LogicException;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const CommandInterface = Jymfony.Contracts.Console.CommandInterface;

/**
 * Base class for all commands.
 *
 * @memberOf Jymfony.Component.Console.Command
 */
export default class Command extends implementationOf(CommandInterface) {
    /**
     * Constructor.
     *
     * @param {string} name
     */
    __construct(name = undefined) {
        this._name = undefined;
        this._synopsis = {};
        this._aliases = [];
        this._usages = [];
        this._ignoreValidationError = false;
        this._definition = new InputDefinition();
        this._help = '';
        this._description = '';
        this._hidden = false;
        this._applicationDefinitionMerged = false;
        this._applicationDefinitionMergedWithArgs = false;
        this._code = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._processTitle = undefined;

        /**
         * @type {Jymfony.Component.Console.Application}
         *
         * @private
         */
        this._application = undefined;

        if (undefined === name || null === name) {
            name = this.constructor.defaultName;
        }

        if (!! name) {
            const aliases = name.split('|');
            name = aliases.shift();

            if ('' === name) {
                this.hidden = true;
                name = aliases.shift();
            }

            this.aliases = aliases;
        }

        this.name = name;
        this.configure();

        if (null === this.name || undefined === this.name) {
            throw new LogicException(
                __jymfony.sprintf('The command defined in "%s" cannot have an empty name.', ReflectionClass.getClassName(this))
            );
        }
    }

    /**
     * Gets the default command name.
     *
     * @returns {string}
     */
    static get defaultName() {
        return null;
    }

    /**
     * Ignores validation errors.
     *
     * This is mainly useful for the help command.
     */
    ignoreValidationError() {
        this._ignoreValidationError = true;
    }

    /**
     * Checks whether the command is enabled or not in the current environment.
     *
     * Override this return false if the command can not
     * run properly under the current conditions.
     *
     * @returns {boolean}
     */
    isEnabled() {
        return true;
    }

    /**
     * Configures the current command.
     */
    configure() {
    }

    /**
     * Executes the current command.
     * You need to override this method. Defining it as a generator
     * you can yield a Promise and waiting asynchronously for its
     * completion, retrieving its value and surrounding it with a
     * try...catch block in case of rejection
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input An InputInterface instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An OutputInterface instance
     *
     * @returns {Promise<void|int>|undefined|int} undefined or 0 if everything went fine, or an error code
     *
     * @throws {Jymfony.Component.Console.Exception.LogicException.LogicException} When this abstract method is not implemented
     */
    async execute(input, output) { // eslint-disable-line no-unused-vars
        throw new LogicException('You must override the execute() method in the concrete command class.');
    }

    /**
     * Sets the code to execute when running this command.
     *
     * If this method is used, it overrides the code defined
     * in the execute() method.
     *
     * @param {Function} code A callable accepting (input, output)
     *
     * @throws {InvalidArgumentException}
     */
    set code(code) {
        if (! isFunction(code)) {
            throw new InvalidArgumentException('Code is not a function');
        }

        this._code = new BoundFunction(this, code);
    }

    /**
     * Interacts with the user.
     *
     * This method is executed before the InputDefinition is validated.
     * This means that this is the only place where the command can
     * interactively ask for values of missing required arguments.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input An InputInterface instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An OutputInterface instance
     */
    async interact(input, output) { // eslint-disable-line no-unused-vars
    }

    /**
     * Initializes the command just after the input has been validated.
     *
     * This is mainly useful when a lot of commands extends one main command
     * where some things need to be initialized based on the input arguments and options.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input An InputInterface instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An OutputInterface instance
     */
    async initialize(input, output) { // eslint-disable-line no-unused-vars
    }

    /**
     * Runs the command.
     *
     * The code to execute is either defined by overriding the execute() method
     * in a sub-class.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input An InputInterface instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An OutputInterface instance
     *
     * @returns {Promise<int>} The command exit code
     *
     * @see execute()
     */
    async run(input, output) {
        // Force the creation of the synopsis before the merge with the app definition
        this.getSynopsis(true);
        this.getSynopsis(false);

        // Add the application arguments and options
        this.mergeApplicationDefinition();

        // Bind the input against the command specific arguments/options
        try {
            input.bind(this._definition);
        } catch (e) {
            if (! (e instanceof ExceptionInterface) || ! this._ignoreValidationError) {
                throw e;
            }
        }

        await this.initialize(input, output);

        if (undefined !== this._processTitle) {
            process.title = this._processTitle;
        }

        if (input.interactive) {
            await this.interact(input, output);
        }

        // The command name argument is often omitted when a command is executed directly with its run() method.
        // It would fail the validation if we didn't make sure the command argument is present,
        // Since it's required by the application.
        if (input.hasArgument('command') && undefined === input.getArgument('command')) {
            input.setArgument('command', this.name);
        }

        input.validate();

        const statusCode = await (undefined !== this._code ? this._code(input, output) : this.execute(input, output));

        return ! Number.isNaN(statusCode) ? ~~statusCode : 0;
    }

    /**
     * Adds suggestions to $suggestions for the current completion input (e.g. option or argument).
     *
     * @param {Jymfony.Component.Console.Completion.CompletionInput} input
     * @param {Jymfony.Component.Console.Completion.CompletionSuggestions} suggestions
     */
    async complete(input, suggestions) { // eslint-disable-line no-unused-vars
    }

    /**
     * Merges the application definition with the command definition.
     *
     * This method is not part of public API and should not be used directly.
     *
     * @param {boolean} mergeArgs Whether to merge or not the Application definition arguments to Command definition arguments
     */
    mergeApplicationDefinition(mergeArgs = true) {
        if (! this._application || (true === this._applicationDefinitionMerged && (this._applicationDefinitionMergedWithArgs || mergeArgs))) {
            return;
        }

        this._definition.addOptions(this._application.definition.getOptions());

        if (mergeArgs) {
            const currentArguments = this._definition.getArguments();
            this._definition.setArguments(this._application.definition.getArguments());
            this._definition.addArguments(currentArguments);
        }

        this._applicationDefinitionMerged = true;
        if (mergeArgs) {
            this._applicationDefinitionMergedWithArgs = true;
        }
    }

    /**
     * Sets the application instance for this command.
     *
     * @param {Jymfony.Component.Console.Application} application An Application instance
     */
    set application(application) {
        this._application = application;
    }

    /**
     * Gets the application instance for this command.
     *
     * @returns {Jymfony.Component.Console.Application}
     */
    get application() {
        return this._application;
    }

    /**
     * Sets an array of argument and option instances.
     *
     * @param {Array|Jymfony.Component.Console.Input.InputDefinition} definition An array of argument and option instances or a definition instance
     */
    set definition(definition) {
        if (definition instanceof InputDefinition) {
            this._definition = definition;
        } else {
            this._definition.setDefinition(definition);
        }

        this._applicationDefinitionMerged = false;
    }

    /**
     * Gets the InputDefinition attached to this Command.
     *
     * @returns {Jymfony.Component.Console.Input.InputDefinition} An InputDefinition instance
     */
    get definition() {
        return this._definition;
    }

    /**
     * Gets the InputDefinition to be used to create representations of this Command.
     *
     * Can be overridden to provide the original command representation when it would otherwise
     * be changed by merging with the application InputDefinition.
     *
     * This method is not part of public API and should not be used directly.
     *
     * @returns {Jymfony.Component.Console.Input.InputDefinition} An InputDefinition instance
     */
    get nativeDefinition() {
        return this.definition;
    }

    /**
     * Adds an argument.
     *
     * @param {string} name The argument name
     * @param {int} [mode] The argument mode: InputArgument.REQUIRED or InputArgument.OPTIONAL
     * @param {string} [description = ''] A description text
     * @param {*} [defaultValue] The default value (for InputArgument::OPTIONAL mode only)
     *
     * @returns {Jymfony.Component.Console.Command.Command} The current instance
     */
    addArgument(name, mode = undefined, description = '', defaultValue = undefined) {
        this._definition.addArgument(new InputArgument(name, mode, description, defaultValue));

        return this;
    }

    /**
     * Adds an option.
     *
     * @param {string} name The option name
     * @param {string} [shortcut] The shortcut (can be null)
     * @param {int} [mode] The option mode: One of the InputOption.VALUE_* constants
     * @param {string} [description = ''] A description text
     * @param {*} [defaultValue] The default value (must be undefined for InputOption.VALUE_NONE)
     *
     * @returns {Jymfony.Component.Console.Command.Command} The current instance
     */
    addOption(name, shortcut = undefined, mode = undefined, description = '', defaultValue = undefined) {
        this._definition.addOption(new InputOption(name, shortcut, mode, description, defaultValue));

        return this;
    }

    /**
     * Sets the name of the command.
     *
     * This method can set both the namespace and the name if
     * you separate them by a colon (:)
     *
     *     command.name = 'foo:bar';
     *
     * @param {string} name The command name
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When the name is invalid
     */
    set name(name) {
        this._validateName(name);

        this._name = name;
    }

    /**
     * Returns the command name.
     *
     * @returns {string} The command name
     */
    get name() {
        return this._name;
    }

    /**
     * Sets the process title of the command.
     *
     * This feature should be used only when creating a long process command,
     * like a daemon.
     *
     * @param {string} title The process title
     */
    set processTitle(title) {
        this._processTitle = title;
    }

    /**
     * @param {boolean} hidden Whether or not the command should be hidden from the list of commands
     */
    set hidden(hidden) {
        this._hidden = !! hidden;
    }

    /**
     * @returns {boolean} Whether the command should be publicly shown or not.
     */
    get hidden() {
        return this._hidden;
    }

    /**
     * Sets the description for the command.
     *
     * @param {string} description The description for the command
     */
    set description(description) {
        this._description = description;
    }

    /**
     * Returns the description for the command.
     *
     * @returns {string} The description for the command
     */
    get description() {
        return this._description;
    }

    /**
     * Sets the help for the command.
     *
     * @param {string} help The help for the command
     */
    set help(help) {
        this._help = help;
    }

    /**
     * Returns the help for the command.
     *
     * @returns {string} The help for the command
     */
    get help() {
        return this._help;
    }

    /**
     * Returns the processed help for the command replacing the %command.name% and
     * %command.full_name% patterns with the real values dynamically.
     *
     * @returns {string} The processed help for the command
     */
    get processedHelp() {
        const name = this._name;

        return (this.help || this.description)
            .replace(/%command\.name%/g, name)
            .replace(/%command\.full_name%/g, process.argv[1] + ' ' + name)
        ;
    }

    /**
     * Sets the aliases for the command.
     *
     * @param {string[]} aliases An array of aliases for the command
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When an alias is invalid
     */
    set aliases(aliases) {
        if (! isArray(aliases) && ! isObjectLiteral(aliases)) {
            throw new InvalidArgumentException('aliases must be an array or a literal object');
        }

        for (const alias of Object.values(aliases)) {
            this._validateName(alias);
        }

        this._aliases = Object.values(aliases);
    }

    /**
     * Returns the aliases for the command.
     *
     * @returns {string[]} An array of aliases for the command
     */
    get aliases() {
        return this._aliases;
    }

    /**
     * Returns the synopsis for the command.
     *
     * @param {boolean} [short = false] Whether to show the short version of the synopsis (with options folded) or not
     *
     * @returns {string} The synopsis
     */
    getSynopsis(short = false) {
        const key = short ? 'short' : 'long';

        if (undefined === this._synopsis[key]) {
            this._synopsis[key] = __jymfony.trim(__jymfony.sprintf('%s %s', this._name, this._definition.getSynopsis(short)));
        }

        return this._synopsis[key];
    }

    /**
     * Add a command usage example.
     *
     * @param {string} usage The usage, it'll be prefixed with the command name
     *
     * @returns {Jymfony.Component.Console.Command.Command} The current instance
     */
    addUsage(usage) {
        if (0 !== usage.indexOf(this._name)) {
            usage = __jymfony.sprintf('%s %s', this._name, usage);
        }

        this._usages.push(usage);

        return this;
    }

    /**
     * Returns alternative usages of the command.
     *
     * @returns {string[]}
     */
    get usages() {
        return this._usages;
    }

    /**
     * Validates a command name.
     *
     * It must be non-empty and parts can optionally be separated by ":".
     *
     * @param {string} name
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When the name is invalid
     *
     * @private
     */
    _validateName(name) {
        if (! /^[^\:]+(\:[^\:]+)*$/.test(name)) {
            throw new InvalidArgumentException(`Command name "${name}" is invalid.`);
        }
    }
}

Object.defineProperty(Command, 'SUCCESS', { value: 0, writable: false });
Object.defineProperty(Command, 'FAILURE', { value: 1, writable: false });
Object.defineProperty(Command, 'INVALID', { value: 2, writable: false });
