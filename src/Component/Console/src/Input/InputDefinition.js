const LogicException = Jymfony.Component.Console.Exception.LogicException;
const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const InputOption = Jymfony.Component.Console.Input.InputOption;

const util = require("util");

/**
 * @memberOf Jymfony.Component.Console.Input
 * @type InputDefinition
 */
module.exports = class InputDefinition {
    /**
     * @param {Array} definition An array of InputArgument or InputOption
     */
    constructor(definition = []) {
        this.setDefinition(definition);
    }

    /**
     * Sets the input definition
     *
     * @param {Array} definition
     */
    setDefinition(definition) {
        let args = [];
        let options = [];

        for (let argument of definition) {
            if (argument instanceof InputOption) {
                options.push(argument);
            } else {
                args.push(argument);
            }
        }

        this.setArguments(args);
        this.setOptions(options);
    }

    /**
     * Sets arguments for this definition
     *
     * @param {Jymfony.Component.Console.Input.InputArgument[]} args
     */
    setArguments(args = undefined) {
        /**
         * The arguments array
         *
         * @type Object.<string, Jymfony.Component.Console.Input.InputArgument>
         * @private
         */
        this._arguments = {};
        this._requiredCount = 0;
        this._hasOptional = false;
        this._hasAnArrayArgument = false;
        this.addArguments(args);
    }

    /**
     * Adds arguments to the definition
     *
     * @param {Jymfony.Component.Console.Input.InputArgument[]} args
     */
    addArguments(args) {
        if (! args) {
            return;
        }

        for (let argument of args) {
            this.addArgument(argument);
        }
    }

    /**
     * Adds an argument
     *
     * @param {Jymfony.Component.Console.Input.InputArgument} argument
     */
    addArgument(argument) {
        let name = argument.getName();
        if (this._arguments[name]) {
            throw new LogicException(`An argument with name "${name}" already exists.`);
        }

        if (this._hasAnArrayArgument) {
            throw new LogicException('Cannot add an argument after an argument array.');
        }

        if (argument.isRequired() && this._hasOptional) {
            throw new LogicException('Cannot add a required argument after an optional one.');
        }

        if (argument.isArray()) {
            this._hasAnArrayArgument = true;
        }

        if (argument.isRequired()) {
            ++this._requiredCount;
        } else {
            this._hasOptional = true;
        }

        this._arguments[name] = argument;
    }

    /**
     * Gets an argument by name or index
     *
     * @param {string|int} name
     *
     * @returns {Jymfony.Component.Console.Input.InputArgument}
     */
    getArgument(name) {
        if (! this.hasArgument(name)) {
            throw new InvalidArgumentException(`The argument "${name}" does not exist`);
        }

        return isNumber(name) ? Object.values(this._arguments)[name] : this._arguments[name];
    }

    /**
     * Returns true if an argument exists
     *
     * @param {string|int} name
     * @returns {boolean}
     */
    hasArgument(name) {
        let arg = isNumber(name) ? Object.values(this._arguments)[name] : this._arguments[name];

        return arg !== undefined;
    }

    /**
     * Gets the InputArgument array
     *
     * @returns {Jymfony.Component.Console.Input.InputArgument[]}
     */
    getArguments() {
        return Object.values(this._arguments);
    }

    /**
     * Returns the number of required arguments
     *
     * @returns {int}
     */
    getArgumentCount() {
        return this._requiredCount;
    }

    /**
     * Gets the arguments default values.
     *
     * @returns {Object.<string, *>}
     */
    getArgumentDefaults() {
        let ret = {};
        for (let argument of Object.values(this._arguments)) {
            ret[argument.getName()] = argument.getDefault();
        }

        return ret;
    }

    /**
     * Sets options for the definition
     *
     * @param {Jymfony.Component.Console.Input.InputOption[]} options
     */
    setOptions(options) {
        /**
         * The options array
         *
         * @type Object.<string, Jymfony.Component.Console.Input.InputOption>
         * @private
         */
        this._options = {};

        /**
         * Shortcut to name array
         *
         * @type Object.<string, string>
         * @private
         */
        this._shortcuts = {};
        this.addOptions(options);
    }

    /**
     * Add input options.
     *
     * @param {Jymfony.Component.Console.Input.InputOption[]} options
     */
    addOptions(options) {
        for (let option of options) {
            this.addOption(option);
        }
    }

    /**
     * Adds an option.
     *
     * @param {Jymfony.Component.Console.Input.InputOption} option
     */
    addOption(option) {
        let name = option.getName();
        if (this._options[name] && ! this._options[name].equals(option)) {
            throw new LogicException(`An option named "${name}" already exists.`);
        }

        let shortcuts;
        if (option.getShortcut()) {
            shortcuts = option.getShortcut().split('|');
            for (let shortcut of shortcuts) {
                if (this._shortcuts[shortcut] && !this._options[this._shortcuts[shortcut]].equals(option)) {
                    throw new LogicException(`An option with shortcut "${shortcut}" has been already defined`);
                }
            }
        }

        this._options[name] = option;
        if (option.getShortcut()) {
            for (let shortcut of shortcuts) {
                this._shortcuts[shortcut] = name;
            }
        }
    }

    /**
     * Returns an input option by name.
     *
     * @param {string} name
     */
    getOption(name) {
        if (! this.hasOption(name)) {
            throw new InvalidArgumentException(`Option "${name}" does not exists`);
        }

        return this._options[name];
    }

    /**
     * Checks if an option exists
     *
     * @param {string} name
     */
    hasOption(name) {
        return !! this._options[name];
    }

    /**
     * Gets the array of options
     *
     * @returns {Jymfony.Component.Console.Input.InputOption[]}
     */
    getOptions() {
        return Object.values(this._options);
    }

    /**
     * Checks if a shortcut has been defined
     *
     * @param {string} shortcut
     *
     * @returns {boolean}
     */
    hasShortcut(shortcut) {
        return !! this._shortcuts[shortcut];
    }

    /**
     *
     *
     * @param shortcut
     * @returns {Jymfony.Component.Console.Input.InputOption}
     */
    getOptionForShortcut(shortcut) {
        if (! this.hasShortcut(shortcut)) {
            throw new InvalidArgumentException(`Shortcut "${name}" does not exists`);
        }

        return this._options[this._shortcuts[shortcut]];
    }

    /**
     * Get default option values.
     *
     * @returns {Object.<string, *>}
     */
    getOptionDefaults() {
        let ret = {};
        for (let option of this.getOptions()) {
            ret[option.getName()] = option.getDefault();
        }

        return ret;
    }

    /**
     * Gets the synopsis
     *
     * @param short Whether to return the short version
     *
     * @returns {string}
     */
    getSynopsis(short = false) {
        let elements = [];

        if (short && this.getOptions().length) {
            elements.push('[options]');
        } else if (! short) {
            for (let option of this.getOptions()) {
                let value = '';
                if (option.acceptValue()) {
                    value = util.format(
                        ' %s%s%s',
                        option.isValueOptional() ? '[' : '',
                        option.getName().toUpperCase(),
                        option.isValueOptional() ? ']' : ''
                    );
                }

                let shortcut = option.getShortcut() ? util.format('-%s|', option.getShortcut()) : '';
                elements.push(util.format('[%s--%s%s]', shortcut, option.getName(), value));
            }
        }

        if (elements.length && this.getArguments().length) {
            elements.push('[--]');
        }

        for (let argument of this.getArguments()) {
            let element = '<' + argument.getName() + '>';
            if (! argument.isRequired()) {
                element = '[' + element + ']';
            } else if (argument.isArray()) {
                element = element + ' (' + element + ')';
            }

            if (argument.isArray()) {
                element += '...';
            }

            elements.push(element);
        }

        return elements.join(' ');
    }
};
