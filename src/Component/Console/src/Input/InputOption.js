const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const LogicException = Jymfony.Component.Console.Exception.LogicException;

/**
 * @memberOf Jymfony.Component.Console.Input
 */
class InputOption {
    /**
     * Constructor
     *
     * @param {string} name
     * @param {string|Array|undefined} [shortcut]
     * @param {int|undefined} [mode]
     * @param {string} [description = '']
     * @param {*} [defaultValue]
     */
    __construct(name, shortcut = undefined, mode = undefined, description = '', defaultValue = undefined) {
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

        if (this.isArray() && ! this.acceptValue()) {
            throw new InvalidArgumentException('Impossible to have an option mode VALUE_IS_ARRAY if the option does not accept a value.');
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

        /**
         * @type {*}
         *
         * @private
         */
        this._default = this.acceptValue() ? defaultValue : false;
    }

    /**
     * Gets the default value.
     *
     * @returns {*}
     */
    getDefault() {
        return this._default;
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
            && option.isArray() === this.isArray()
            && option.isValueRequired() === this.isValueRequired()
            && option.isValueOptional() === this.isValueOptional()
        ;
    }
}

InputOption.VALUE_NONE = 1;
InputOption.VALUE_REQUIRED = 2;
InputOption.VALUE_OPTIONAL = 4;
InputOption.VALUE_IS_ARRAY = 8;

module.exports = InputOption;
