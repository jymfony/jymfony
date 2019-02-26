const Command = Jymfony.Component.Console.Command.Command;
const ConsoleEvents = Jymfony.Component.Console.ConsoleEvents;
const CommandNotFoundException = Jymfony.Component.Console.Exception.CommandNotFoundException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;
const ArgvInput = Jymfony.Component.Console.Input.ArgvInput;
const ArrayInput = Jymfony.Component.Console.Input.ArrayInput;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const StreamableInputInterface = Jymfony.Component.Console.Input.StreamableInputInterface;
const ConsoleOutput = Jymfony.Component.Console.Output.ConsoleOutput;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;
const Terminal = Jymfony.Component.Console.Terminal;

/**
 * @memberOf Jymfony.Component.Console
 */
class Application {
    /**
     * Constructor.
     *
     * @param {string} [name = 'UNKNOWN']
     * @param {string} [version = 'UNKNOWN']
     */
    __construct(name = 'UNKNOWN', version = 'UNKNOWN') {
        this._name = name;
        this._version = version;
        this._eventDispatcher = undefined;
        this._defaultCommand = 'list';
        this._definition = this._getDefaultInputDefinition();
        this._commands = {};
        this._terminal = new Terminal();
        this._catchExceptions = true;
        this._autoExit = true;
        this._runningCommand = undefined;
        this._wantHelps = false;

        for (const command of this._getDefaultCommands()) {
            this.add(command);
        }
    }

    /**
     * Sets the event dispatcher.
     *
     * @param {Jymfony.Component.EventDispatcher.EventDispatcher} dispatcher
     */
    set dispatcher(dispatcher) {
        this._eventDispatcher = dispatcher;
    }

    /**
     * Set an input definition to be used with this application.
     *
     * @param {Jymfony.Component.Console.Input.InputDefinition} definition The input definition
     */
    set definition(definition) {
        this._definition = definition;
    }

    /**
     * Gets the InputDefinition related to this Application.
     *
     * @returns {Jymfony.Component.Console.Input.InputDefinition} The InputDefinition instance
     */
    get definition() {
        return this._definition;
    }

    /**
     * Gets the help message.
     *
     * @returns {string} A help message
     */
    get help() {
        return this.getLongVersion();
    }

    /**
     * Sets the default Command name.
     *
     * @param {string} commandName The Command name
     */
    set defaultCommand(commandName) {
        this._defaultCommand = commandName;
    }

    /**
     * Sets whether to catch exceptions while running or not.
     *
     * @param {boolean} catchExceptions
     */
    set catchExceptions(catchExceptions) {
        this._catchExceptions = catchExceptions;
    }

    /**
     * Sets if application should automatically terminate when run
     * has been completed.
     *
     * @param {boolean} autoExit
     */
    set autoExit(autoExit) {
        this._autoExit = autoExit;
    }

    /**
     * Run the application
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} [input = new ArgvInput()]
     * @param {Jymfony.Component.Console.Output.OutputInterface} [output new ConsoleOutput()]
     *
     * @returns {Promise<int>} Promise executing the application
     */
    async run(input = new ArgvInput(), output = new ConsoleOutput()) {
        this._configureIO(input, output);

        let exitCode;

        try {
            exitCode = await this._doRun(input, output);
        } catch (exception) {
            if (! this._catchExceptions) {
                throw exception;
            }

            if (output instanceof ConsoleOutputInterface) {
                this._renderException(exception, output.errorOutput);
            } else {
                this._renderException(exception, output);
            }

            exitCode = exception.code || 1;
            if (! isNumber(exitCode)) {
                exitCode = 1;
            }

            if (255 < exitCode) {
                exitCode = 255;
            }
        }

        if (this._autoExit) {
            // Wait for next uncork call.
            process.nextTick(async () => {
                await this.shutdown(exitCode);
            });
        }

        return process.exitCode = exitCode;
    }

    /**
     * Shuts down the application.
     */
    shutdown(exitCode) {
        process.exit(exitCode);
    }

    /**
     * Returns the long version of the application.
     *
     * @returns {string} The long application version
     */
    getLongVersion() {
        if ('UNKNOWN' !== this.name) {
            if ('UNKNOWN' !== this.version) {
                return __jymfony.sprintf('%s <info>%s</info>', this.name, this.version);
            }

            return this.name;
        }

        return 'Console Tool';
    }

    /**
     * Registers a new command.
     *
     * @param {string} name The command name
     *
     * @returns {Jymfony.Component.Console.Command.Command} The newly created command
     */
    register(name) {
        return this.add(new Command(name));
    }

    /**
     * Adds an array of command objects.
     *
     * If a Command is not enabled it will not be added.
     *
     * @param {Jymfony.Component.Console.Command.Command[]} commands An array of commands
     */
    addCommands(commands) {
        for (const command of commands) {
            this.add(command);
        }
    }

    /**
     * Adds a command object.
     *
     * If a command with the same name already exists, it will be overridden.
     * If the command is not enabled it will not be added.
     *
     * @param {Jymfony.Component.Console.Command.Command} command A Command object
     *
     * @returns {Jymfony.Component.Console.Command.Command|undefined} The registered command if enabled or null
     */
    add(command) {
        command.application = this;

        if (! command.isEnabled()) {
            command.application = undefined;

            return;
        }

        if (! command.definition) {
            throw new LogicException(__jymfony.sprintf(
                'Command class "%s" is not correctly initialized. You probably forgot to call the parent constructor.',
                ReflectionClass.getClassName(command)
            ));
        }

        this._commands[command.name] = command;

        for (const alias of command.aliases) {
            this._commands[alias] = command;
        }

        return command;
    }

    /**
     * Returns a registered command by name or alias.
     *
     * @param {string} name The command name or alias
     *
     * @returns {Jymfony.Component.Console.Command.Command} A Command object
     *
     * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException} When command name given does not exist
     */
    get(name) {
        if (undefined === this._commands[name]) {
            throw new CommandNotFoundException(`The command "${name}" does not exist.`);
        }

        const command = this._commands[name];

        if (this._wantHelps) {
            this._wantHelps = false;

            const helpCommand = this.get('help');
            helpCommand.command = command;

            return helpCommand;
        }

        return command;
    }

    /**
     * Returns true if the command exists, false otherwise.
     *
     * @param {string} name The command name or alias
     *
     * @returns {boolean} true if the command exists, false otherwise
     */
    has(name) {
        return this._commands[name] !== undefined;
    }

    /**
     * Finds a command by name or alias.
     *
     * Contrary to get, this command tries to find the best
     * match if you give it an abbreviation of a name or alias.
     *
     * @param {string} name A command name or a command alias
     *
     * @returns {Jymfony.Component.Console.Command.Command} A Command instance
     *
     * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException} When command name is incorrect or ambiguous
     */
    find(name) {
        const allCommands = Object.keys(this._commands);
        const expr = name.replace(/([^:]+|)/g, (match, p1) => {
            return __jymfony.regex_quote(p1) + '[^:]*';
        });

        const begin_regex = new RegExp('^' + expr);
        const full_regex = new RegExp('^' + expr + '$');
        let commands = allCommands.filter(V => V.match(begin_regex));

        if (! commands.length || 1 > commands.filter(V => V.match(full_regex)).length) {
            const pos = name.lastIndexOf(':');
            if (-1 !== pos) {
                // Check if a namespace exists and contains commands
                this.findNamespace(name.substr(0, pos));
            }

            let message = `Command "${name}" is not defined.`;

            const alternatives = this._findAlternatives(name, allCommands);
            if (alternatives.length) {
                if (1 == alternatives.length) {
                    message += '\n\nDid you mean this?\n    ';
                } else {
                    message += '\n\nDid you mean one of these?\n    ';
                }

                message += alternatives.join('\n    ');
            }

            throw new CommandNotFoundException(message, alternatives);
        }

        // Filter out aliases for commands which are already on the list
        if (1 < commands.length) {
            commands = commands.filter(nameOrAlias => {
                const commandName = this._commands[nameOrAlias].name;

                return commandName === nameOrAlias || -1 === Object.values(commands).indexOf(commandName);
            });
        }

        const exact = -1 !== Object.values(commands).indexOf(name);
        if (1 < commands.length && ! exact) {
            const usableWidth = this._terminal.width - 10;
            let abbrevs = Object.values(commands);

            let maxLen = 0;
            for (const abbrev of abbrevs) {
                maxLen = Math.max(abbrev.length, maxLen);
            }

            const spaces = Array(maxLen).fill(' ').join('');
            abbrevs = abbrevs.map(cmd => {
                const abbrev = (cmd + spaces).substr(0, maxLen) + ' ' + this._commands[cmd].description;
                return abbrev.length > usableWidth ? abbrev.substr(0, usableWidth - 3) + '...' : abbrev;
            });

            const suggestions = this._getAbbreviationSuggestions(abbrevs);
            throw new CommandNotFoundException(`Command "${name}" is ambiguous.\nDid you mean one of these?\n${suggestions}`, commands);
        }

        return this.get(exact ? name : commands[0]);
    }

    /**
     * Gets the commands (registered in the given namespace if provided).
     *
     * The object keys are the full names and the values the command instances.
     *
     * @param {string} [namespace] A namespace name
     *
     * @returns {Object.<string, Jymfony.Component.Console.Command.Command>} An array of Command instances
     */
    all(namespace = undefined) {
        if (undefined === namespace) {
            return Object.assign({}, this._commands);
        }

        const commands = {};
        for (const [ name, command ] of __jymfony.getEntries(this._commands)) {
            if (namespace === this.extractNamespace(name, namespace.split(':').length + 1)) {
                commands[name] = command;
            }
        }

        return commands;
    }

    /**
     * Finds a registered namespace by a name or an abbreviation.
     *
     * @param {string} namespace A namespace or abbreviation to search for
     *
     * @returns {string} A registered namespace
     *
     * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException} When namespace is incorrect or ambiguous
     */
    findNamespace(namespace) {
        const allNamespaces = this.namespaces;
        const expr = namespace.replace(/([^:]+|)/g, (match, p1) => {
            return __jymfony.regex_quote(p1) + '[^:]*';
        });

        const regex = new RegExp('^' + expr);
        const namespaces = allNamespaces.filter(V => V.match(regex));

        if (! namespaces.length) {
            let message = `There are no commands defined in the "${namespace}" namespace.`, alternatives;

            if (alternatives = this._findAlternatives(namespace, allNamespaces)) {
                if (1 === alternatives.length) {
                    message += '\n\nDid you mean this?\n    ';
                } else {
                    message += '\n\nDid you mean one of these?\n    ';
                }

                message += alternatives.join('\n    ');
            }

            throw new CommandNotFoundException(message, alternatives);
        }

        const exact = -1 !== namespaces.indexOf(namespace);
        if (1 < namespaces.length && ! exact) {
            throw new CommandNotFoundException(`The namespace "${namespace}" is ambiguous.\nDid you mean one of these?\n${this._getAbbreviationSuggestions(namespaces)}`, namespaces);
        }

        return exact ? namespace : namespaces[0];
    }

    /**
     * Returns the namespace part of the command name.
     *
     * This method is not part of public API and should not be used directly.
     *
     * @param {string} name The full name of the command
     * @param {int} [limit] The maximum number of parts of the namespace
     *
     * @returns {string} The namespace of the command
     */
    extractNamespace(name, limit = undefined) {
        const parts = name.split(':');
        parts.pop();

        return (limit ? parts.slice(0, limit) : parts).join(':');
    }

    /**
     * Gets the name of the application.
     *
     * @returns {string} The application name
     */
    get name() {
        return this._name;
    }

    /**
     * Sets the application name.
     *
     * @param {string} name The application name
     */
    set name(name) {
        this._name = name;
    }

    /**
     * Gets the application version.
     *
     * @returns {string} The application version
     */
    get version() {
        return this._version;
    }

    /**
     * Sets the application version.
     *
     * @param {string} version The application version
     */
    set version(version) {
        this._version = version;
    }

    /**
     * Returns an array of all unique namespaces used by currently registered commands.
     *
     * It does not return the global namespace which always exists.
     *
     * @returns {string[]} An array of namespaces
     */
    get namespaces() {
        let namespaces = [];
        for (const command of Object.values(this.all())) {
            namespaces = [ ...namespaces, ...this._extractAllNamespaces(command.name) ];

            for (const alias of command.aliases) {
                namespaces = [ ...namespaces, ...this._extractAllNamespaces(alias) ];
            }
        }

        return Array.from(new Set(namespaces.filter(v => !! v)));
    }

    /**
     * Runs the current application.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input An Input instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An Output instance
     *
     * @returns {Promise<int>} 0 if everything went fine, or an error code
     *
     * @protected
     */
    async _doRun(input, output) {
        if (true === input.hasParameterOption([ '--version', '-V' ], true)) {
            output.writeln(this.getLongVersion());

            return 0;
        }

        let name = this._getCommandName(input);
        if (true === input.hasParameterOption([ '--help', '-h' ], true)) {
            if (! name) {
                name = 'help';
                input = new ArrayInput({'command_name': this._defaultCommand});
            } else {
                this._wantHelps = true;
            }
        }

        if (! name) {
            name = this._defaultCommand;
            input = new ArrayInput({'command': this._defaultCommand});
        }

        // The command name MUST be the first element of the input
        let command;
        try {
            command = this.find(name);
        } catch (e) {
            if (this._eventDispatcher) {
                const event = new Jymfony.Component.Console.Event.ConsoleErrorEvent(input, output, e, command);
                await this._eventDispatcher.dispatch(ConsoleEvents.ERROR, event);

                e = event.error;
                if (0 === event.exitCode) {
                    return 0;
                }
            }

            throw e;
        }

        this._runningCommand = command;
        const exitCode = await this._doRunCommand(command, input, output);
        this._runningCommand = undefined;

        return exitCode;
    }

    /**
     * Runs the current command.
     *
     * If an event dispatcher has been attached to the application,
     * events are also dispatched during the life-cycle of the command.
     *
     * @param {Jymfony.Component.Console.Command.Command} command A Command instance
     * @param {Jymfony.Component.Console.Input.InputInterface} input An Input instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An Output instance
     *
     * @returns {Promise<int>} 0 if everything went fine, or an error code
     *
     * @throws {Exception} when the command being run threw an exception
     */
    async _doRunCommand(command, input, output) {
        if (! this._eventDispatcher) {
            return await command.run(input, output);
        }

        // Bind before the console.command event, so the listeners have access to input options/arguments
        try {
            command.mergeApplicationDefinition();
            input.bind(command.definition);
        } catch (e) {
            if (! (e instanceof ExceptionInterface)) {
                throw e;
            }
            // Ignore invalid options/arguments for now, to allow the event listeners to customize the InputDefinition
        }

        let exitCode;
        let e;
        let event = new Jymfony.Component.Console.Event.ConsoleCommandEvent(command, input, output);
        await this._eventDispatcher.dispatch(ConsoleEvents.COMMAND, event);

        if (event.commandShouldRun) {
            try {
                exitCode = await command.run(input, output);
            } catch (x) {
                e = x;
            }

            if (undefined !== e) {
                event = new Jymfony.Component.Console.Event.ConsoleErrorEvent(input, output, e, command);
                await this._eventDispatcher.dispatch(ConsoleEvents.ERROR, event);
                e = event.error;

                if (0 === (exitCode = event.exitCode)) {
                    e = undefined;
                }
            }
        } else {
            exitCode = Jymfony.Component.Console.Event.ConsoleCommandEvent.RETURN_CODE_DISABLED;
        }

        event = new Jymfony.Component.Console.Event.ConsoleTerminateEvent(command, input, output, exitCode);
        await this._eventDispatcher.dispatch(ConsoleEvents.TERMINATE, event);

        if (undefined !== e) {
            throw e;
        }

        return event.exitCode;
    }

    /**
     * Configures the input and output instances based on the user arguments and options.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input An InputInterface instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An OutputInterface instance
     *
     * @protected
     */
    _configureIO(input, output) {
        if (true === input.hasParameterOption([ '--ansi' ], true)) {
            output.decorated = true;
        } else if (true === input.hasParameterOption([ '--no-ansi' ], true)) {
            output.decorated = false;
        }

        if (true === input.hasParameterOption([ '--no-interaction', '-n' ], true)) {
            input.interactive = false;
        } else if (input instanceof StreamableInputInterface) {
            const inputStream = input.stream;
            if (undefined !== inputStream && ! inputStream.isTTY && ! process.env.SHELL_INTERACTIVE) {
                input.interactive = false;
            }
        }

        if (true === input.hasParameterOption([ '--quiet', '-q' ], true)) {
            output.verbosity = OutputInterface.VERBOSITY_QUIET;
            input.interactive = false;
        } else {
            if (input.hasParameterOption('-vvv', true) || input.hasParameterOption('--verbose=3', true) || 3 === input.getParameterOption('--verbose', false, true)) {
                output.verbosity = OutputInterface.VERBOSITY_DEBUG;
            } else if (input.hasParameterOption('-vv', true) || input.hasParameterOption('--verbose=2', true) || 2 === input.getParameterOption('--verbose', false, true)) {
                output.verbosity = OutputInterface.VERBOSITY_VERY_VERBOSE;
            } else if (input.hasParameterOption('-v', true) || input.hasParameterOption('--verbose=1', true) || input.hasParameterOption('--verbose', true) || input.getParameterOption('--verbose', false, true)) {
                output.verbosity = OutputInterface.VERBOSITY_VERBOSE;
            }
        }
    }

    /**
     * Gets the default input definition.
     *
     * @returns {Jymfony.Component.Console.Input.InputDefinition}
     *
     * @protected
     */
    _getDefaultInputDefinition() {
        return new InputDefinition([
            new InputArgument('command', InputArgument.REQUIRED, 'The command to execute'),

            new InputOption('--help', 'h', InputOption.VALUE_NONE, 'Display this help message'),
            new InputOption('--quiet', 'q', InputOption.VALUE_NONE, 'Do not output any message'),
            new InputOption('--verbose', 'v|vv|vvv', InputOption.VALUE_NONE, 'Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug'),
            new InputOption('--version', 'V', InputOption.VALUE_NONE, 'Display this application version'),
            new InputOption('--ansi', '', InputOption.VALUE_NONE, 'Force ANSI output'),
            new InputOption('--no-ansi', '', InputOption.VALUE_NONE, 'Disable ANSI output'),
            new InputOption('--no-interaction', 'n', InputOption.VALUE_NONE, 'Do not ask any interactive question'),
        ]);
    }

    /**
     * Gets the built-in commands.
     *
     * @returns {Jymfony.Component.Console.Command.Command[]}
     *
     * @protected
     */
    _getDefaultCommands() {
        return [
            new Jymfony.Component.Console.Command.ListCommand(),
            new Jymfony.Component.Console.Command.HelpCommand(),
        ];
    }

    /**
     * Gets the name of the command
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     *
     * @returns {string}
     *
     * @protected
     */
    _getCommandName(input) {
        return input.firstArgument;
    }

    /**
     * Renders a catched exception
     *
     * @param {Error} exception
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     *
     * @protected
     */
    _renderException(exception, output) {
        output.writeln('', OutputInterface.VERBOSITY_QUIET);

        do {
            const title = __jymfony.sprintf('  [%s%s]  ',
                ReflectionClass.getClassName(exception) || exception.constructor.name || 'Error',
                output.isVerbose() && exception.code ? ` (${exception.code})` : ''
            );
            let len = title.length;

            const width = this._terminal.width - 1;
            const formatter = output.formatter;

            const lines = [];
            for (let line of exception.message.split('\r?\n')) {
                for (line of this._splitStringByWidth(line, width - 4)) {
                    // Pre-format lines to get the right string length
                    const lineLength = line.length + 4;
                    lines.push([ line, lineLength ]);

                    len = Math.max(lineLength, len);
                }
            }

            const messages = [];
            let emptyLine;
            messages.push(emptyLine = formatter.format(__jymfony.sprintf('<error>%s</error>', ' '.repeat(len))));
            messages.push(formatter.format(__jymfony.sprintf('<error>%s%s</error>', title, ' '.repeat(Math.max(0, len - title.length)))));
            for (const line of lines) {
                messages.push(formatter.format(__jymfony.sprintf('<error>  %s  %s</error>', OutputFormatter.escape(line[0]), ' '.repeat(len - line[1]))));
            }
            messages.push(emptyLine);
            messages.push('');

            output.writeln(messages, OutputInterface.OUTPUT_RAW | OutputInterface.VERBOSITY_QUIET);

            if (OutputInterface.VERBOSITY_VERBOSE <= output.verbosity) {
                const trace = exception.stackTrace || Exception.parseStackTrace(exception) || [];
                if (trace && trace.length) {
                    output.writeln('<comment>Exception trace:</comment>', OutputInterface.VERBOSITY_QUIET);

                    // Exception related properties
                    for (const current of trace) {
                        const func = current['function'];
                        const file = current['file'] || 'n/a';
                        const line = current['line'] || 'n/a';
                        output.writeln(__jymfony.sprintf('   %s() at <info>%s:%s</info>', func, file, line), OutputInterface.VERBOSITY_QUIET);
                    }

                    output.writeln('', OutputInterface.VERBOSITY_QUIET);
                }
            }
        } while (exception = exception.previous);

        if (this._runningCommand) {
            output.writeln(__jymfony.sprintf('<info>%s</info>', this._runningCommand.getSynopsis()), OutputInterface.VERBOSITY_QUIET);
            output.writeln('', OutputInterface.VERBOSITY_QUIET);
        }
    }

    * _splitStringByWidth(line, number) {
        const rx = new RegExp(`(.{1,${number}})`, 'g');
        let chunk;

        while (chunk = rx.exec(line)) {
            yield chunk[1];
        }
    }

    /**
     * Finds alternative of name among collection,
     * if nothing is found in collection, try in abbrevs.
     *
     * @param {string} name The string
     * @param {string[]} collection The collection
     *
     * @returns {string[]} A sorted array of similar string
     *
     * @private
     */
    _findAlternatives(name, collection) {
        const threshold = 1e3;
        const alternatives = {};

        const collectionParts = {};
        for (const item of collection) {
            collectionParts[item] = item.split(':');
        }

        for (const [ i, subname ] of __jymfony.getEntries(name.split(':'))) {
            for (const [ collectionName, parts ] of __jymfony.getEntries(collectionParts)) {
                const exists = undefined !== alternatives[collectionName];
                if (! parts[i] && exists) {
                    alternatives[collectionName] += threshold;
                    continue;
                } else if (! parts[i]) {
                    continue;
                }

                const lev = __jymfony.levenshtein(subname, parts[i]);
                if (lev <= subname.length / 3 || '' !== subname && -1 !== parts[i].indexOf(subname)) {
                    alternatives[collectionName] = exists ? alternatives[collectionName] + lev : lev;
                } else if (exists) {
                    alternatives[collectionName] += threshold;
                }
            }
        }

        for (const item of collection) {
            const lev = __jymfony.levenshtein(name, item);
            if (lev <= name.length / 3 || -1 !== item.indexOf(name)) {
                alternatives[item] = undefined !== alternatives[item] ? alternatives[item] - lev : lev;
            }
        }

        return Object.keys(Object.filter(alternatives, lev => lev < 2 * threshold)).sort();
    }

    /**
     * Returns abbreviated suggestions in string format.
     *
     * @param {string[]} abbrevs Abbreviated suggestions to convert
     *
     * @returns {string} A formatted string of abbreviated suggestions
     */
    _getAbbreviationSuggestions(abbrevs) {
        return '    ' + abbrevs.join('\n    ');
    }

    /**
     * Returns all namespaces of the command name.
     *
     * @param {string} name The full name of the command
     *
     * @returns {string[]} The namespaces of the command
     */
    _extractAllNamespaces(name) {
        const parts = name.split(':');
        parts.splice(parts.length - 1);

        const namespaces = [];

        for (const part of parts) {
            if (namespaces.length) {
                namespaces.push(namespaces[namespaces.length-1] + ':' + part);
            } else {
                namespaces.push(part);
            }
        }

        return namespaces;
    }
}

module.exports = Application;
