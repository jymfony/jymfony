const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const LogicException = Jymfony.Component.Console.Exception.LogicException;

/**
 * @memberOf Jymfony.Component.Console.Input
 */
export default class InputOption {
    /**
     * Constructor
     *
     * @param {string} name
     * @param {string|Array|undefined} [shortcut]
     * @param {int|undefined} [mode]
     * @param {string} [description = '']
     * @param {*} [defaultValue]
     * @param {(string | Jymfony.Component.Console.Completion.Suggestion)[] | function(Jymfony.Component.Console.Completion.CompletionInput, Jymfony.Component.Console.Completion.CompletionSuggestions): (string | Jymfony.Component.Console.Completion.Suggestion)[]} [suggestedValues = []]
     */
    __construct(name, shortcut = undefined, mode = undefined, description = '', defaultValue = undefined, suggestedValues = []) {
        if (0 === name.indexOf('--')) {
            name = name.substring(2);
        }

        if (! name) {
            throw new InvalidArgumentException('An option cannot have empty name');
        }

        if (! shortcut) {
            shortcut = undefined;
        }

        if (shortcut) {
            if (isArray(shortcut)) {
                shortcut = shortcut.join('|');
            }

            shortcut = shortcut.split('|').map(v => __jymfony.trim(v)).filter(T => !! T).join('|');
            if (0 === shortcut.length) {
                shortcut = undefined;
            }
        }

        if (undefined === mode) {
            mode = InputOption.VALUE_NONE;
        } else if (! isNumber(mode) || 15 < mode || 1 > mode) {
            throw new InvalidArgumentException(`Option mode "${mode}" is not valid.`);
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {string}
         *
         * @private
         */
        this._shortcut = shortcut;

        /**
         * @type {int}
         *
         * @private
         */
        this._mode = mode;

        /**
         * @type {string}
         *
         * @private
         */
        this._description = description;

        /**
         * @type {*}
         *
         * @private
         */
        this._default = null;

        /**
         * @type {(string | Jymfony.Component.Console.Completion.Suggestion)[] | function(Jymfony.Component.Console.Completion.CompletionInput, Jymfony.Component.Console.Completion.CompletionSuggestions): (string | Jymfony.Component.Console.Completion.Suggestion)[]}
         *
         * @private
         */
        this._suggestedValues = suggestedValues;

        if ((!isArray(suggestedValues) || 0 < suggestedValues.length) && ! this.acceptValue()) {
            throw new LogicException('Cannot set suggested values if the option does not accept a value.');
        }

        if (this.isArray() && ! this.acceptValue()) {
            throw new InvalidArgumentException('Impossible to have an option mode VALUE_IS_ARRAY if the option does not accept a value.');
        }
        if (this.isNegatable() && this.acceptValue()) {
            throw new InvalidArgumentException('Impossible to have an option mode VALUE_NEGATABLE if the option also accepts a value.');
        }

        this.setDefault(defaultValue);
    }

    /**
     * Gets the shortcut(s).
     *
     * @returns {string}
     */
    getShortcut() {
        return this._shortcut || '';
    }

    /**
     * Gets the name.
     *
     * @returns {string}
     */
    getName() {
        return this._name;
    }

    /**
     * Returns true if the option accepts a value.
     *
     * @returns {boolean}
     */
    acceptValue() {
        return this.isValueRequired() || this.isValueOptional();
    }

    /**
     * Whether the option value is required or not.
     *
     * @returns {boolean}
     */
    isValueRequired() {
        return InputOption.VALUE_REQUIRED === (this._mode & InputOption.VALUE_REQUIRED);
    }

    /**
     * Whether the option value is optional or not.
     *
     * @returns {boolean}
     */
    isValueOptional() {
        return InputOption.VALUE_OPTIONAL === (this._mode & InputOption.VALUE_OPTIONAL);
    }

    /**
     * Whether the argument is an array.
     *
     * @returns {boolean}
     */
    isArray() {
        return InputOption.VALUE_IS_ARRAY === (this._mode & InputOption.VALUE_IS_ARRAY);
    }

    /**
     * Whether the option is negatable (has "no-" variant).
     *
     * @returns {boolean}
     */
    isNegatable() {
        return InputOption.VALUE_NEGATABLE === (this._mode & InputOption.VALUE_NEGATABLE);
    }

    /**
     * Sets the default value
     *
     * @param {*} defaultValue
     *
     * @throws {Jymfony.Component.Console.Exception.LogicException} If the argument is required
     */
    setDefault(defaultValue) {
        if (InputOption.VALUE_NONE === (this._mode & InputOption.VALUE_NONE) && undefined !== defaultValue) {
            throw new LogicException('You cannot set a default value when using VALUE_NONE mode.');
        }

        if (this.isArray()) {
            if (undefined === defaultValue) {
                defaultValue = [];
            } else if (! isArray(defaultValue)) {
                throw new LogicException('A default value for an array argument must be an array.');
            }
        }

        this._default = this.acceptValue() || this.isNegatable() ? defaultValue : false;
    }

    /**
     * Gets the default value.
     *
     * @returns {*}
     */
    getDefault() {
        return this._default;
    }

    hasCompletion() {
        return [] !== this._suggestedValues;
    }

    /**
     * Adds suggestions to $suggestions for the current completion input.
     *
     * @param {Jymfony.Component.Console.Completion.CompletionInput} input
     * @param {Jymfony.Component.Console.Completion.CompletionSuggestions} suggestions
     *
     * @see Jymfony.Component.Console.Command.Command.complete()
     */
    async complete(input, suggestions) {
        let values = this._suggestedValues;
        if (isFunction(values) && !isArray(values = await values(input))) {
            throw new LogicException(__jymfony.sprintf('Closure for argument "%s" must return an array. Got "%s".', this._name, __jymfony.get_debug_type(values)));
        }

        if (0 < values.length) {
            suggestions.suggestValues(values);
        }
    }

    /**
     * Gets the option description.
     *
     * @returns {string}
     */
    getDescription() {
        return this._description;
    }

    /**
     * Whether this option equals another option
     *
     * @param {Jymfony.Component.Console.Input.InputOption} option
     *
     * @returns {boolean}
     */
    equals(option) {
        return option.getName() === this.getName()
            && option.getShortcut() === this.getShortcut()
            && option.getDefault() === this.getDefault()
            && option.isNegatable() === this.isNegatable()
            && option.isArray() === this.isArray()
            && option.isValueRequired() === this.isValueRequired()
            && option.isValueOptional() === this.isValueOptional()
        ;
    }
}

Object.defineProperties(InputOption, {
    VALUE_NONE: { value: 1, writable: false },
    VALUE_REQUIRED: { value: 2, writable: false },
    VALUE_OPTIONAL: { value: 4, writable: false },
    VALUE_IS_ARRAY: { value: 8, writable: false },
    VALUE_NEGATABLE: { value: 16, writable: false },
});
