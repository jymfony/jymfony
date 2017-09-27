/**
 * @memberOf Jymfony.Component.Console.Descriptor
 *
 * @internal
 */
class ApplicationDescription {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Application} application
     * @param {string|undefined} namespace
     */
    __construct(application, namespace = undefined) {
        this._application = application;
        this._namespace = namespace;
    }

    /**
     * @returns {string[]}
     */
    get namespaces() {
        if (undefined === this._namespaces) {
            this._inspectApplication();
        }

        return Object.values(this._namespaces);
    }

    /**
     * @returns {Jymfony.Component.Console.Command.Command[]}
     */
    get commands() {
        if (undefined === this._commands) {
            this._inspectApplication();
        }

        return Object.assign({}, this._commands);
    }

    /**
     * @param {string} name
     *
     * @returns {Jymfony.Component.Console.Command.Command}
     *
     * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException}
     */
    getCommand(name) {
        if (! this._commands[name] && ! this._aliases[name]) {
            throw new CommandNotFoundException(`Command ${name} does not exist.`);
        }

        return this._commands[name] || this._aliases[name];
    }

    _inspectApplication() {
        this._aliases = {};
        this._commands = {};
        this._namespaces = {};

        const all = this._application.all(this._namespace ? this._application.findNamespace(this._namespace) : undefined);
        for (const [ namespace, commands ] of this._sortCommands(all)) {
            const names = [];

            /** @var Command command */
            for (const [ name, command ] of commands) {
                if (! command.name || command.hidden) {
                    continue;
                }

                if (command.name === name) {
                    this._commands[name] = command;
                } else {
                    this._aliases[name] = command;
                }

                names.push(name);
            }

            this._namespaces[namespace] = {id: namespace, commands: names};
        }
    }

    /**
     * @param {Object.<string, Jymfony.Component.Console.Command.Command>} commands
     *
     * @returns array
     */
    * _sortCommands(commands) {
        const namespacedCommands = {};
        const globalCommands = {};
        for (const [ name, command ] of __jymfony.getEntries(commands)) {
            const key = this._application.extractNamespace(name, 1);
            if (! key) {
                if (! globalCommands._global) {
                    globalCommands._global = {};
                }

                globalCommands._global[name] = command;
            } else {
                if (! namespacedCommands[key]) {
                    namespacedCommands[key] = {};
                }

                namespacedCommands[key][name] = command;
            }
        }

        const y = function * (ns) {
            for (const name of Object.keys(ns).sort()) {
                yield [ name, ns[name] ];
            }
        };

        yield [ '_global', Array.from(y(globalCommands._global)) ];

        for (const namespace of Object.keys(namespacedCommands)) {
            yield [ namespace, Array.from(y(namespacedCommands[namespace])) ];
        }
    }
}

ApplicationDescription.GLOBAL_NAMESPACE = '_global';

module.exports = ApplicationDescription;
