const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const LogicException = Jymfony.Component.Console.Exception.LogicException;

/**
 * @memberOf Jymfony.Component.Console.Input
 */
class InputArgument {
    /**
     * Constructor.
     *
     * @param {string} name
     * @param {int|undefined} [mode]
     * @param {string} [description = '']
     * @param {*} [defaultValue]
     */
    __construct(name, mode = undefined, description = '', defaultValue = undefined) {
        if (undefined === mode) {
            mode = InputArgument.OPTIONAL;
        } else if (! isNumber(mode) || 7 < mode || 1 > mode) {
            throw new InvalidArgumentException(`Argument mode "${mode}" is not valid.`);
        }

        /**
         * @type string
         *
         * @private
         */
        this._name = name;

        /**
         * @type {int|undefined}
         *
         * @private
         */
        this._mode = mode;

        /**
         * @type {string|undefined}
         *
         * @private
         */
        this._description = description;

        this.setDefault(defaultValue);
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
     * Whether the argument is required or not.
     *
     * @returns {boolean}
     */
    isRequired() {
        return InputArgument.REQUIRED === (this._mode & InputArgument.REQUIRED);
    }

    /**
     * Whether the argument is an array.
     *
     * @returns {boolean}
     */
    isArray() {
        return InputArgument.IS_ARRAY === (this._mode & InputArgument.IS_ARRAY);
    }

    /**
     * Sets the default value
     *
     * @param {*} defaultValue
     *
     * @throws {Jymfony.Component.Console.Exception.LogicException} If the argument is required
     */
    setDefault(defaultValue) {
        if (undefined !== defaultValue && this.isRequired()) {
            throw new LogicException('You can only set a default to an optional argument');
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
        this._default = defaultValue;
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
     * Gets the argument description.
     *
     * @returns {string}
     */
    getDescription() {
        return this._description;
    }
}

InputArgument.REQUIRED = 1;
InputArgument.OPTIONAL = 2;
InputArgument.IS_ARRAY = 4;

module.exports = InputArgument;
