const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const InvalidOptionException = Jymfony.Component.Console.Exception.InvalidOptionException;
const Input = Jymfony.Component.Console.Input.Input;

/**
 * ArrayInput represents an input provided as an array.
 *
 * Usage:
 *
 *     $input = new ArrayInput(array('name' => 'foo', '--bar' => 'foobar'));
 *
 * @memberOf Jymfony.Component.Console.Input
 * @type ArrayInput
 */
module.exports = class ArrayInput extends Input {
    /**
     * @param {Object.<string, string>} parameters
     * @param {Jymfony.Component.Console.Input.InputDefinition} definition
     */
    __construct(parameters, definition = undefined) {
        this._parameters = parameters;

        super.__construct(definition);
    }

    /**
     * @inheritDoc
     */
    get firstArgument() {
        for (let [ key, value ] of __jymfony.getEntries(this._parameters)) {
            if ('-' === key[0]) {
                continue;
            }

            return value;
        }
    }

    /**
     * @inheritDoc
     */
    hasParameterOption(values, onlyParams = false) {
        if (! isArray(values) || ! isObjectLiteral(values)) {
            values = [ values ];
        }

        for (let [ k, v ] of __jymfony.getEntries(this._parameters)) {
            if (! isNumber(k)) {
                v = k;
            }

            if (onlyParams && '--' === v) {
                return false;
            }

            if (-1 !== Object.values(values).indexOf(v)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @inheritDoc
     */
    getParameterOption(values, defaultValue = false, onlyParams = false) {
        if (! isArray(values) || ! isObjectLiteral(values)) {
            values = [ values ];
        }

        for (let [ k, v ] of __jymfony.getEntries(this._parameters)) {
            if (onlyParams && ('--' === k || (isNumber(k) && '--' === v))) {
                return false;
            }

            if (isNumber(k)) {
                if (-1 !== Object.values(values).indexOf(v)) {
                    return true;
                }
            } else if (-1 !== Object.values(values).indexOf(k)) {
                return v;
            }
        }

        return defaultValue;
    }

    /**
     * @inheritDoc
     */
    toString() {
        let params = [];
        for (let [ param, val ] of __jymfony.getEntries(this._parameters)) {
            if (param && '-' === param[0]) {
                params.push(param + ('' != val ? '=' + this.escapeToken(val) : ''));
            } else {
                params.push(this.escapeToken(val));
            }
        }

        return params.join(' ');
    }

    /**
     * @inheritDoc
     */
    parse() {
        for (let [ key, value ] of __jymfony.getEntries(this._parameters)) {
            if ('--' === key) {
                return;
            }

            if (0 === key.indexOf('--')) {
                this._addLongOption(key.substr(2), value);
            } else if ('-' === key[0]) {
                this._addShortOption(key.substr(1), value);
            } else {
                this._addArgument(key, value);
            }
        }
    }

    /**
     * Adds a short option value.
     *
     * @param {string} shortcut The short option key
     * @param {*} value The value for the option
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When option given doesn't exist
     *
     * @private
     */
    _addShortOption(shortcut, value) {
        if (! this._definition.hasShortcut(shortcut)) {
            throw new InvalidOptionException(`The "-${shortcut}" option does not exist.`);
        }

        this._addLongOption(this._definition.getOptionForShortcut(shortcut).getName(), value);
    }

    /**
     * Adds a long option value.
     *
     * @param {string} name  The long option key
     * @param {*} value The value for the option
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When option given doesn't exist
     * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When a required value is missing
     *
     * @private
     */
    _addLongOption(name, value) {
        if (! this._definition.hasOption(name)) {
            throw new InvalidOptionException(sprintf('The "--%s" option does not exist.', $name));
        }

        let option = this._definition.getOption(name);

        if (! value) {
            if (option.isValueRequired()) {
                throw new InvalidOptionException(`The "--${name}" option requires a value.`);
            }

            value = option.isValueOptional() ? option.getDefault() : true;
        }

        this._options[name] = value;
    }

    /**
     * Adds an argument value.
     *
     * @param {string} name  The argument name
     * @param {*} value The value for the argument
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When argument given doesn't exist
     *
     * @private
     */
    _addArgument(name, value) {
        if (! this._definition.hasArgument(name)) {
            throw new InvalidArgumentException(`The "${name}" argument does not exist.`);
        }

        this._arguments[name] = value;
    }
};
