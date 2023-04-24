const Command = Jymfony.Component.Console.Command.Command;

/**
 * @memberOf Jymfony.Component.Console.Command
 */
export default class LazyCommand extends Command {
    /**
     * @param {string} name
     * @param {string[]} aliases
     * @param {string} description
     * @param {boolean} isHidden
     * @param {function(): Jymfony.Component.Console.Command.Command} commandFactory
     * @param {boolean} [isEnabled = true]
     */
    __construct(name, aliases, description, isHidden, commandFactory, isEnabled = true) {
        this.name = name;
        this.aliases = aliases;
        this.hidden = isHidden;
        this.description = description;

        /**
         * @type {function(): Jymfony.Component.Console.Command.Command | Jymfony.Component.Console.Command.Command}
         *
         * @private
         */
        this._command = commandFactory;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._isEnabled = isEnabled;
    }

    ignoreValidationError() {
        this._getCommand().ignoreValidationError();
    }

    set application(application) {
        if (this._command instanceof Command) {
            this._command.application = application;
        }

        super.application = application;
    }

    isEnabled() {
        return null === this._isEnabled || this._isEnabled === undefined ? this._getCommand().isEnabled() : this._isEnabled;
    }

    run(input, output) {
        return this._getCommand().run(input, output);
    }

    complete(input, suggestions) {
        return this._getCommand().complete(input, suggestions);
    }

    set code(code) {
        this._getCommand().code = code;
    }

    /**
     * @internal
     */
    mergeApplicationDefinition(mergeArgs = true) {
        this._getCommand().mergeApplicationDefinition(mergeArgs);
    }

    set definition(definition) {
        this._getCommand().definition = definition;
    }

    get definition() {
        return this._getCommand().definition;
    }

    get nativeDefinition() {
        return this._getCommand().nativeDefinition;
    }

    addArgument(name, mode = undefined, description = '', defaultValue = undefined, suggestedValues = []) {
        this._getCommand().addArgument(name, mode, description, defaultValue, suggestedValues);

        return this;
    }

    addOption(name, shortcut = undefined, mode = undefined, description = '', defaultValue = undefined, suggestedValues = []) {
        this._getCommand().addOption(name, shortcut, mode, description, defaultValue, suggestedValues);

        return this;
    }

    set processTitle(title) {
        this._getCommand().processTitle = title;
    }

    set help(help) {
        this._getCommand().help = help;
    }

    get help() {
        return this._getCommand().help;
    }

    get processedHelp() {
        return this._getCommand().processedHelp;
    }

    getSynopsis(short = false) {
        return this._getCommand().getSynopsis(short);
    }

    addUsage(usage) {
        this._getCommand().addUsage(usage);

        return this;
    }

    get usages() {
        return this._getCommand().usages;
    }

    _getCommand() {
        if (! isFunction(this._command)) {
            return this._command;
        }

        const command = this._command = this._command();
        command.application = this.application;

        command.name = this.name;
        command.aliases = this.aliases;
        command.hidden = this.hidden;
        command.description = this.description;

        return command;
    }
}
