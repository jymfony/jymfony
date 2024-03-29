const LogicException = Jymfony.Component.Console.Exception.LogicException;
const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const InputOption = Jymfony.Component.Console.Input.InputOption;

/**
 * @memberOf Jymfony.Component.Console.Input
 */
export default class InputDefinition {
    /**
     * @param {Array} [definition = []] An array of InputArgument or InputOption
     */
    __construct(definition = []) {
        /**
         * The arguments array
         *
         * @type {Object.<string, Jymfony.Component.Console.Input.InputArgument>}
         *
         * @private
         */
        this._arguments = {};
        this._requiredCount = 0;
        this._hasOptional = false;
        this._hasAnArrayArgument = false;

        /**
         * The options array
         *
         * @type {Object.<string, Jymfony.Component.Console.Input.InputOption>}
         * @private
         */
        this._options = {};

        /**
         * The negations options array
         *
         * @type {Object.<string, string>}
         * @private
         */
        this._negations = {};

        /**
         * Shortcut to name array
         *
         * @type {Object.<string, string>}
         * @private
         */
        this._shortcuts = {};

        this.setDefinition(definition);
    }

    /**
     * Sets the input definition
     *
     * @param {Array} definition
     */
    setDefinition(definition) {
        const args = [];
        const options = [];

        for (const argument of definition) {
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

        for (const argument of args) {
            this.addArgument(argument);
        }

        return this;
    }

    /**
     * Adds an argument
     *
     * @param {Jymfony.Component.Console.Input.InputArgument} argument
     */
    addArgument(argument) {
        const name = argument.getName();
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

        return this;
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
     *
     * @returns {boolean}
     */
    hasArgument(name) {
        const arg = isNumber(name) ? Object.values(this._arguments)[name] : this._arguments[name];

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
        const ret = {};
        for (const argument of Object.values(this._arguments)) {
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
        this._options = {};
        this._shortcuts = {};
        this._negations = {};

        this.addOptions(options);
    }

    /**
     * Add input options.
     *
     * @param {Jymfony.Component.Console.Input.InputOption[]} options
     */
    addOptions(options) {
        for (const option of options) {
            this.addOption(option);
        }

        return this;
    }

    /**
     * Adds an option.
     *
     * @param {Jymfony.Component.Console.Input.InputOption} option
     */
    addOption(option) {
        const name = option.getName();
        if (this._options[name] && ! this._options[name].equals(option)) {
            throw new LogicException(`An option named "${name}" already exists.`);
        }
        if (undefined !== this._negations[name]) {
            throw new LogicException(`An option named "${name}" already exists.`);
        }

        let shortcuts;
        if (option.getShortcut()) {
            shortcuts = option.getShortcut().split('|');
            for (const shortcut of shortcuts) {
                if (this._shortcuts[shortcut] && !this._options[this._shortcuts[shortcut]].equals(option)) {
                    throw new LogicException(`An option with shortcut "${shortcut}" already exists.`);
                }
            }
        }

        this._options[name] = option;
        if (option.getShortcut()) {
            for (const shortcut of shortcuts) {
                this._shortcuts[shortcut] = name;
            }
        }

        if (option.isNegatable()) {
            const negatedName = 'no-' + option.getName();
            if (!! this._options[negatedName]) {
                throw new LogicException(__jymfony.sprintf('An option named "%s" already exists.', negatedName));
            }

            this._negations[negatedName] = option.getName();
        }

        return this;
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
     * Returns true if an InputOption object exists by negated name.
     *
     * @param {string} name
     */
    hasNegation(name) {
        return undefined !== this._negations[name];
    }

    /**
     * @param {string} shortcut
     *
     * @returns {Jymfony.Component.Console.Input.InputOption}
     */
    getOptionForShortcut(shortcut) {
        return this.getOption(this.shortcutToName(shortcut));
    }

    /**
     * Returns the InputOption name given a shortcut.
     *
     * @param {string} shortcut
     *
     * @throws {InvalidArgumentException} When option given does not exist
     *
     * @internal
     */
    shortcutToName(shortcut) {
        if (undefined === this._shortcuts[shortcut]) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "-%s" option does not exist.', shortcut));
        }

        return this._shortcuts[shortcut];
    }

    /**
     * Returns the InputOption name given a negation.
     *
     * @param {string} negation
     *
     * @throws {InvalidArgumentException} When option given does not exist
     *
     * @internal
     */
    negationToName(negation) {
        if (undefined === this._negations[negation]) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "--%s" option does not exist.', negation));
        }

        return this._negations[negation];
    }

    /**
     * Get default option values.
     *
     * @returns {Object.<string, *>}
     */
    getOptionDefaults() {
        const ret = {};
        for (const option of this.getOptions()) {
            ret[option.getName()] = option.getDefault();
        }

        return ret;
    }

    /**
     * Gets the synopsis
     *
     * @param {boolean} [short = false] Whether to return the short version
     *
     * @returns {string}
     */
    getSynopsis(short = false) {
        const elements = [];

        if (short && this.getOptions().length) {
            elements.push('[options]');
        } else if (! short) {
            for (const option of this.getOptions()) {
                let value = '';
                if (option.acceptValue()) {
                    value = __jymfony.sprintf(
                        ' %s%s%s',
                        option.isValueOptional() ? '[' : '',
                        option.getName().toUpperCase(),
                        option.isValueOptional() ? ']' : ''
                    );
                }

                const shortcut = option.getShortcut() ? __jymfony.sprintf('-%s|', option.getShortcut()) : '';
                const negation = option.isNegatable() ? __jymfony.sprintf('|--no-%s', option.getName()) : '';
                elements.push(__jymfony.sprintf('[%s--%s%s%s]', shortcut, option.getName(), value, negation));
            }
        }

        if (elements.length && this.getArguments().length) {
            elements.push('[--]');
        }

        let tail = '';
        for (const argument of this.getArguments()) {
            let element = '<' + argument.getName() + '>';
            if (argument.isArray()) {
                element += '...';
            }

            if (! argument.isRequired()) {
                element = '[' + element;
                tail += ']';
            }

            elements.push(element);
        }

        return elements.join(' ') + tail;
    }
}
