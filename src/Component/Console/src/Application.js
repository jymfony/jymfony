const Command = Jymfony.Component.Console.Command.Command;
const CommandNotFoundException = Jymfony.Component.Console.Exception.CommandNotFoundException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;
const HelperSet = Jymfony.Component.Console.Helper.HelperSet;
const ArgvInput = Jymfony.Component.Console.Input.ArgvInput;
const ArrayInput = Jymfony.Component.Console.Input.ArrayInput;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputAwareInterface = Jymfony.Component.Console.Input.InputAwareInterface;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const ConsoleOutput = Jymfony.Component.Console.Output.ConsoleOutput;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

const util = require('util');

/**
 * @memberOf Jymfony.Component.Console
 * @type Application
 */
module.exports = class Application {
    constructor(name = 'UNKNOWN', version = 'UNKNOWN') {
        this._name = name;
        this._version = version;
        this._eventDispatcher = undefined;
        this._defaultCommand = 'list';
        this._helperSet = this._getDefaultHelperSet();
        this._definition = this._getDefaultInputDefinition();
        this._commands = {};

        for (let command of this._getDefaultCommands()) {
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
     * Gets the helper set.
     *
     * @returns {Jymfony.Component.Console.Helper.HelperSet}
     */
    get helperSet() {
        return this._helperSet;
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
     * Sets the default Command name.
     *
     * @param {string} commandName The Command name
     */
    set defaultCommand(commandName) {
        this._defaultCommand = commandName;
    }

    /**
     * Run the application
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     *
     * @returns {Promise} Promise executing the application
     */
    run(input, output) {
        if (! input) {
            input = new ArgvInput();
        }

        if (! output) {
            output = new ConsoleOutput();
        }

        this._configureIO(input, output);

        let promise = __jymfony.Async.run(this._doRun(input, output));

        return promise
            .catch((exception) => {
                if (output instanceof ConsoleOutputInterface) {
                    this._renderException(exception, output.errorOutput);
                } else {
                    this._renderException(exception, output);
                }

                let exitCode = exception.code || 1;
                if (! isNumber(exitCode)) {
                    exitCode = 1;
                }

                if (255 < exitCode) {
                    exitCode = 255;
                }

                return exitCode;
            })
            .then(exitCode => {
                return process.exitCode = exitCode;
            })
        ;
    }

    /**
     * Returns the long version of the application.
     *
     * @return string The long application version
     */
    getLongVersion() {
        if ('UNKNOWN' !== this.name) {
            if ('UNKNOWN' !== this.version) {
                return util.format('<info>%s</info> version <comment>%s</comment>', this.name, this.version);
            }

            return util.format('<info>%s</info>', this.name);
        }

        return '<info>Console Tool</info>';
    }

    /**
     * Registers a new command.
     *
     * @param {string} name The command name
     *
     * @return {Jymfony.Component.Console.Command.Command} The newly created command
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
        for (let command of commands) {
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
     * @return {Jymfony.Component.Console.Command.Command|undefined} The registered command if enabled or null
     */
    add(command) {
        command.application = this;

        if (! command.isEnabled()) {
            command.application = undefined;

            return;
        }

        this._commands[command.name] = command;

        for (let alias of command.aliases) {
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

        let command = this._commands[name];

        if (this._wantHelps) {
            this._wantHelps = false;

            let helpCommand = this.get('help');
            helpCommand.command = command;

            return helpCommand;
        }

        return command;
    }

    /**
     * Finds a command by name or alias.
     *
     * Contrary to get, this command tries to find the best
     * match if you give it an abbreviation of a name or alias.
     *
     * @param {string} name A command name or a command alias
     *
     * @return {Jymfony.Component.Console.Command.Command} A Command instance
     *
     * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException} When command name is incorrect or ambiguous
     */
    find(name) {
        let allCommands = Object.keys(this._commands);
        let expr = name.replace(/([^:]+|)/g, (match, p1) => {
            return __jymfony.regex_quote(p1) + '[^:]*';
        });

        let begin_regex = new RegExp('^' + expr);
        let full_regex = new RegExp('^' + expr + '$');
        let commands = allCommands.filter(V => V.match(begin_regex));

        if (! commands.length || 1 > commands.filter(V => V.match(full_regex)).length) {
            let pos = name.lastIndexOf(':');
            if (-1 !== pos) {
                // Check if a namespace exists and contains commands
                this.findNamespace(name.substr(0, pos));
            }

            let message = `Command "${name}" is not defined.`;

            let alternatives = this._findAlternatives(name, allCommands);
            if (alternatives.length) {
                if (1 == alternatives.length) {
                    message += "\n\nDid you mean this?\n    ";
                } else {
                    message += "\n\nDid you mean one of these?\n    ";
                }

                message += alternatives.join('\n    ');
            }

            throw new CommandNotFoundException(message, alternatives);
        }

        // Filter out aliases for commands which are already on the list
        if (1 < commands.length) {
            commands = commands.filter(nameOrAlias => {
                let commandName = this._commands[nameOrAlias].getName();

                return commandName === nameOrAlias || -1 !== Object.values(commands).indexOf(commandName);
            });
        }

        let exact = -1 !== Object.values(commands).indexOf(name);
        if (1 < commands.length && ! exact) {
            let suggestions = this._getAbbreviationSuggestions(commands);

            throw new CommandNotFoundException(`Command "${name}" is ambiguous (${suggestions}).`, commands);
        }

        return this.get(exact ? name : commands[0]);
    }

    /**
     * Gets the commands (registered in the given namespace if provided).
     *
     * The object keys are the full names and the values the command instances.
     *
     * @param {string} namespace A namespace name
     *
     * @returns {Object.<string, Jymfony.Component.Console.Command.Command[]>} An array of Command instances
     */
    all(namespace = undefined) {
        if (undefined === namespace) {
            return Object.assign({}, this._commands);
        }

        let commands = {};
        for (let [ name, command ] of __jymfony.getEntries(this._commands)) {
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
        let allNamespaces = this.namespaces;
        let expr = name.replace(/([^:]+|)/g, (match, p1) => {
            return __jymfony.regex_quote(p1) + '[^:]*';
        });

        let regex = new RegExp('^' + expr);
        let namespaces = allNamespaces.filter(V => V.match(regex));

        if (! namespaces.length) {
            let message = `There are no commands defined in the "${namespace}" namespace.`, alternatives;

            if (alternatives = this._findAlternatives(namespace, allNamespaces)) {
                if (1 == alternatives.length) {
                    message += "\n\nDid you mean this?\n    ";
                } else {
                    message += "\n\nDid you mean one of these?\n    ";
                }

                message += alternatives.join("\n    ");
            }

            throw new CommandNotFoundException(message, alternatives);
        }

        let exact = -1 !== namespaces.indexOf(namespace);
        if (1 < namespaces && ! exact) {
            throw new CommandNotFoundException(`The namespace "${namespace}" is ambiguous (${this._getAbbreviationSuggestions(namespaces)}).`, namespaces);
        }

        return exact ? namespace : namespaces[0];
    }

    /**
     * Returns the namespace part of the command name.
     *
     * This method is not part of public API and should not be used directly.
     *
     * @param {string} name The full name of the command
     * @param {int} limit The maximum number of parts of the namespace
     *
     * @returns {string} The namespace of the command
     */
    extractNamespace(name, limit = undefined) {
        let parts = name.split(':');
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
        for (let command of this.all) {
            namespaces = [ ...namespaces, ...this._extractAllNamespaces(command.name) ];

            for (let alias of command.aliases) {
                namespaces = [ ...namespaces, ...this._extractAllNamespaces(alias) ];
            }
        }

        return (new Set(namespaces.filter())).toArray();
    }

    /**
     * Runs the current application.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input An Input instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An Output instance
     *
     * @returns {int} 0 if everything went fine, or an error code
     *
     * @protected
     */
    * _doRun(input, output) {
        if (true === input.hasParameterOption([ '--version', '-V' ], true)) {
            output.writeln(this.getLongVersion());

            return 0;
        }

        let name = this._getCommandName(input);
        if (true === input.hasParameterOption([ '--help', '-h' ], true)) {
            if (! name) {
                name = 'help';
                input = new ArrayInput({'command': 'help'});
            } else {
                this._wantHelps = true;
            }
        }

        if (! name) {
            name = this._defaultCommand;
            input = new ArrayInput({'command': this._defaultCommand});
        }

        // The command name MUST be the first element of the input
        let command = this.find(name);

        this._runningCommand = command;
        let exitCode = yield __jymfony.Async.run(getCallableFromArray([ this, '_doRunCommand' ]), command, input, output);
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
     * @return int 0 if everything went fine, or an error code
     *
     * @throws {Exception} when the command being run threw an exception
     */
    * _doRunCommand(command, input, output) {
        for (let helper of command.helperSet) {
            if (helper instanceof InputAwareInterface) {
                helper.input = input;
            }
        }

        if (! this._eventDispatcher) {
            return yield __jymfony.Async.run(getCallableFromArray([ command, 'run' ]), input, output);
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
        let event = new ConsoleCommandEvent(command, input, output);
        yield this._eventDispatcher.dispatch(ConsoleEvents.COMMAND, event);

        if (event.commandShouldRun()) {
            let e = undefined;
            try {
                exitCode = yield __jymfony.Async.run(getCallableFromArray([ command, 'run' ]), input, output);
            } catch (x) {
                e = x;
            }

            if (undefined !== e) {
                event = new ConsoleExceptionEvent(command, input, output, e, e.code);
                yield this._eventDispatcher.dispatch(ConsoleEvents.EXCEPTION, event);

                if (e !== event.exception) {
                    e = event.exception;
                }

                event = new ConsoleTerminateEvent(command, input, output, e.code);
                yield this._eventDispatcher.dispatch(ConsoleEvents.TERMINATE, event);

                throw e;
            }
        } else {
            exitCode = ConsoleCommandEvent.RETURN_CODE_DISABLED;
        }

        event = new ConsoleTerminateEvent(command, input, output, exitCode);
        yield this._eventDispatcher.dispatch(ConsoleEvents.TERMINATE, event);

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
        } else if (this.helperSet.has('question')) {
            let inputStream = this.helperSet.get('question').inputStream;
            if (! inputStream.isTTY && ! process.env['SHELL_INTERACTIVE']) {
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
     * Gets the default helper set.
     *
     * @returns {Jymfony.Component.Console.Helper.HelperSet}
     *
     * @protected
     */
    _getDefaultHelperSet() {
        return new HelperSet();
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
            new InputOption('--no-interaction', '-n', InputOption.VALUE_NONE, 'Do not ask any interactive question'),
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
     * @param exception
     * @param output
     *
     * @protected
     */
    _renderException(exception, output) {
        output.writeln('', OutputInterface.VERBOSITY_QUIET);

        do {
            let title = util.format('  [%s]  ', (new ReflectionClass(exception)).name || exception.constructor.name || 'Error');
            let len = title.length;

            let width = process.stdout.columns || Number.MAX_SAFE_INTEGER;
            let formatter = output.formatter;

            let lines = [];
            for (let line of exception.message.split('\r?\n')) {
                for (line of this._splitStringByWidth(line, width - 4)) {
                    // Pre-format lines to get the right string length
                    let lineLength = formatter.format(line).replace(/\[[^m]*m/g, '').length + 4;
                    lines.push([ line, lineLength ]);

                    len = Math.max(lineLength, len);
                }
            }

            let messages = [], emptyLine;
            messages.push(emptyLine = formatter.format(util.format('<error>%s</error>', ' '.repeat(len))));
            messages.push(formatter.format(util.format('<error>%s%s</error>', title, ' '.repeat(Math.max(0, len - title.length)))));
            for (let line of lines) {
                messages.push(formatter.format(util.format('<error>  %s  %s</error>', line[0], ' '.repeat(len - line[1]))));
            }
            messages.push(emptyLine);
            messages.push('');

            output.writeln(messages, OutputInterface.OUTPUT_RAW | OutputInterface.VERBOSITY_QUIET);

            if (OutputInterface.VERBOSITY_VERBOSE <= output.verbosity) {
                output.writeln('<comment>Exception trace:</comment>', OutputInterface.VERBOSITY_QUIET);
                output.writeln(exception.stack);
                output.writeln('', OutputInterface.VERBOSITY_QUIET);
            }
        } while (exception = exception.previous);

        if (this._runningCommand) {
            output.writeln(util.format('<info>%s</info>', util.format(this._runningCommand.getSynopsis(), this.name)), OutputInterface.VERBOSITY_QUIET);
            output.writeln('', OutputInterface.VERBOSITY_QUIET);
        }
    }

    * _splitStringByWidth(line, number) {
        let rx = new RegExp(`(.{1,${number}})`, 'g'), chunk;
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
     * @returns string[] A sorted array of similar string
     *
     * @private
     */
    _findAlternatives(name, collection) {
        let threshold = 1e3;
        let alternatives = {};

        let collectionParts = {};
        for (let item of collection) {
            collectionParts[item] = item.split(':');
        }

        for (let [ i, subname ] of __jymfony.getEntries(name.split(':'))) {
            for (let [ collectionName, parts ] of __jymfony.getEntries(collectionParts)) {
                let exists = undefined !== alternatives[collectionName];
                if (! parts[i] && exists) {
                    alternatives[collectionName] += threshold;
                    continue;
                } else if (! parts[i]) {
                    continue;
                }

                let lev = __jymfony.levenshtein(subname, parts[i]);
                if (lev <= subname.length / 3 || '' !== subname && -1 !== parts[i].indexOf(subname)) {
                    alternatives[collectionName] = exists ? alternatives[collectionName] + lev : lev;
                } else if (exists) {
                    alternatives[collectionName] += threshold;
                }
            }
        }

        for (let item of collection) {
            let lev = __jymfony.levenshtein(name, item);
            if (lev <= name.length / 3 || -1 !== item.indexOf(name)) {
                alternatives[item] = undefined !== alternatives[item] ? alternatives[item] - lev : lev;
            }
        }

        return Object.keys(Object.sort(Object.filter(alternatives, lev => lev < 2 * threshold)));
    }

    /**
     * Returns abbreviated suggestions in string format.
     *
     * @param {string[]} abbrevs Abbreviated suggestions to convert
     *
     * @return string A formatted string of abbreviated suggestions
     */
    _getAbbreviationSuggestions(abbrevs) {
        return util.format('%s, %s%s', abbrevs[0], abbrevs[1], 2 < abbrevs.length ? ` and ${abbrevs.length - 2} more` : '');
    }

    /**
     * Returns all namespaces of the command name.
     *
     * @param {string} name The full name of the command
     *
     * @returns {string[]} The namespaces of the command
     */
    _extractAllNamespaces(name) {
        let parts = name.split(':');
        parts.splice(parts.length - 1);

        let namespaces = [];

        for (let part of parts) {
            if (namespaces.length) {
                namespaces.push(namespaces[namespaces.length-1] + ':' + part);
            } else {
                namespaces.push(part);
            }
        }

        return namespaces;
    }
};
