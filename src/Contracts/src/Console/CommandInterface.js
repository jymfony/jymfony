class CommandInterface {
    /**
     * Gets the description for the command.
     *
     * @returns {string}
     */
    get description() { }

    /**
     * Sets the description for the command.
     *
     * @param {string} description
     */
    set description(description) { }

    /**
     * The help for the command.
     *
     * @returns {string}
     */
    get help() { }

    /**
     * Sets the help text for this command.
     *
     * @param {string} helpText
     */
    set help(helpText) { }

    /**
     * Gets the name of the command.
     *
     * @returns {string}
     */
    get name() { }

    /**
     * Sets the name of the command.
     * Can set both the namespace and the name if you separate them by a colon (:)
     *
     *     command.name = 'foo:bar';
     *
     * @param {string} name
     */
    set name(name) { }

    /**
     * Configures the current command.
     */
    configure() { }

    /**
     * Runs the command.
     *
     * The code to execute is either defined by overriding the execute() method
     * in a sub-class.
     *
     * @param {Jymfony.Contracts.Console.InputInterface} input
     * @param {Jymfony.Contracts.Console.OutputInterface} output
     *
     * @returns {Promise<int>} The command exit code
     */
    run(input, output) { }

    /**
     * Adds an argument.
     *
     * @param {string} name The argument name
     * @param {int} [mode] The argument mode: InputArgument.REQUIRED or InputArgument.OPTIONAL
     * @param {string} [description = ''] A description text
     * @param {*} [defaultValue] The default value (for InputArgument::OPTIONAL mode only)
     *
     * @returns {Jymfony.Contracts.Console.CommandInterface} The current instance
     */
    addArgument(name, mode, description, defaultValue) { }

    /**
     * Adds an option.
     *
     * @param {string} name The option name
     * @param {string} [shortcut] The shortcut (can be null)
     * @param {int} [mode] The option mode: One of the InputOption.VALUE_* constants
     * @param {string} [description = ''] A description text
     * @param {*} [defaultValue] The default value (must be undefined for InputOption.VALUE_NONE)
     *
     * @returns {Jymfony.Contracts.Console.CommandInterface} The current instance
     */
    addOption(name, shortcut, mode, description, defaultValue) { }

    /**
     * Returns the synopsis for the command.
     *
     * @param {boolean} [short = false] Whether to show the short version of the synopsis (with options folded) or not
     */
    getSynopsis(short) { }
}

export default getInterface(CommandInterface);
