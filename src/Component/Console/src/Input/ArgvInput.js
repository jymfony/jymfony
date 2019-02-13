const RuntimeException = Jymfony.Component.Console.Exception.RuntimeException;
const InvalidOptionException = Jymfony.Component.Console.Exception.InvalidOptionException;
const Input = Jymfony.Component.Console.Input.Input;

/**
 * ArgvInput represents an input coming from the CLI arguments.
 *
 * Usage:
 *
 *     input = new ArgvInput();
 *
 * By default, the `process.argv` array is used for the input values.
 *
 * This can be overridden by explicitly passing the input values in the constructor:
 *
 *     input = new ArgvInput(process.argv);
 *
 * If you pass it yourself, don't forget that the first element of the array
 * is the name of the running application.
 *
 * When passing an argument to the constructor, be sure that it respects
 * the same rules as the argv one. It's almost always better to use the
 * `StringInput` when you want to provide your own input.
 *
 * @see http://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html
 * @see http://www.opengroup.org/onlinepubs/009695399/basedefs/xbd_chap12.html#tag_12_02
 *
 * @memberOf Jymfony.Component.Console.Input
 */
class ArgvInput extends Input {
    /**
     * Constructor.
     *
     * @param {string[]} argv
     * @param {Jymfony.Component.Console.Input.InputDefinition} [definition]]
     */
    __construct(argv = process.argv, definition = undefined) {
        // Skip application name
        this._tokens = argv.slice(2);
        this._parsed = undefined;

        super.__construct(definition);
    }

    /**
     * @inheritdoc
     */
    parse() {
        let parseOptions = true, token;
        this._parsed = [ ...this._tokens ];

        while (token = this._parsed.shift()) {
            if (parseOptions && '' == token) {
                this._parseArgument(token);
            } else if (parseOptions && '--' == token) {
                parseOptions = false;
            } else if (parseOptions && 0 === token.indexOf('--')) {
                this._parseLongOption(token);
            } else if (parseOptions && '-' === token.charAt(0) && '-' !== token) {
                this._parseShortOption(token);
            } else {
                this._parseArgument(token);
            }
        }
    }

    /**
     * @inheritdoc
     */
    get firstArgument() {
        for (const token of this._tokens) {
            if (token && '-' === token[0]) {
                continue;
            }

            return token;
        }
    }

    /**
     * @inheritdoc
     */
    hasParameterOption(values, onlyParams = false) {
        if (! isArray(values)) {
            values = [ values ];
        }

        for (const token of this._tokens) {
            if (onlyParams && '--' === token) {
                return false;
            }

            for (const value of values) {
                if (token === value || 0 === token.indexOf(value+'=')) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    getParameterOption(values, defaultValue = false, onlyParams = false) {
        if (! isArray(values)) {
            values = [ values ];
        }

        const tokens = [ ...this._tokens ];
        let pos;

        while (0 < tokens.length) {
            const token = tokens.shift();
            if (onlyParams && '--' === token) {
                return false;
            }

            for (const value of values) {
                if (token === value || 0 === token.indexOf(value + '=')) {
                    pos = token.indexOf('=');
                    if (-1 !== pos) {
                        return token.substr(pos + 1);
                    }

                    return tokens.shift();
                }
            }
        }

        return defaultValue;
    }

    /**
     * Returns a stringified representation of the args passed to the command.
     *
     * @returns {string}
     */
    toString() {
        return this._tokens.map(token => {
            let match;
            if ((match = /^(-[^=]+=)(.+)/.exec(token))) {
                return match[1] + this.escapeToken(match[2]);
            }

            if (token && '-' !== token[0]) {
                return this.escapeToken(token);
            }

            return token;
        }).join(' ');
    }

    /**
     * Parses an argument.
     *
     * @param {string} token The current token
     *
     * @throws {Jymfony.Component.Console.Exception.RuntimeException} When too many arguments are given
     *
     * @private
     */
    _parseArgument(token) {
        const c = Object.keys(this._arguments).length;

        // If input is expecting another argument, add it
        if (this._definition.hasArgument(c)) {
            const arg = this._definition.getArgument(c);
            this._arguments[arg.getName()] = arg.isArray() ? [ token ] : token;

            // If last argument isArray(), append token to last argument
        } else if (this._definition.hasArgument(c - 1) && this._definition.getArgument(c - 1).isArray()) {
            const arg = this._definition.getArgument(c - 1);
            this._arguments[arg.getName()].push(token);

            // Unexpected argument
        } else {
            const all = this._definition.getArguments();
            if (all.length) {
                throw new RuntimeException(`Too many arguments, expected arguments "${all.map(A => A.getName()).join('" "')}".`);
            }

            throw new RuntimeException(`No arguments expected, got "${token}".`);
        }
    }

    /**
     * Parses a long option.
     *
     * @param {string} token
     *
     * @private
     */
    _parseLongOption(token) {
        const name = token.substr(2);
        let pos;

        if (-1 < (pos = name.indexOf('='))) {
            const value = name.substr(pos + 1);
            if (0 === value.length) {
                this._parsed.unshift(null);
            }

            this._addLongOption(name.substr(0, pos), value);
        } else {
            this._addLongOption(name, undefined);
        }
    }

    /**
     * Adds a long option value.
     *
     * @param {string} name The long option key
     * @param {*} value The value for the option
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When option given doesn't exist
     *
     * @private
     */
    _addLongOption(name, value) {
        if (! this._definition.hasOption(name)) {
            throw new InvalidOptionException(`The "--${name}" option does not exist.`);
        }

        const option = this._definition.getOption(name);

        // Convert empty values to undefined
        if (! value || ! value[0]) {
            value = undefined;
        }

        if (undefined !== value && ! option.acceptValue()) {
            throw new InvalidOptionException(`The "--${name}" option does not accept a value.`);
        }

        if (undefined === value && option.acceptValue() && this._parsed.length) {
            // If option accepts an optional or mandatory argument
            // Let's see if there is one provided
            const next = this._parsed.shift();
            if (next[0] && '-' !== next[0]) {
                value = next;
            } else if (! next) {
                value = undefined;
            } else {
                this._parsed.unshift(next);
            }
        }

        if (undefined === value) {
            if (option.isValueRequired()) {
                throw new InvalidOptionException(`The "--${name}" option requires a value.`);
            }

            if (! option.isArray()) {
                value = option.isValueOptional() ? option.getDefault() : true;
            }
        }

        if (option.isArray()) {
            this._options[name].push(value);
        } else {
            this._options[name] = value;
        }
    }

    /**
     * Parses a short option.
     *
     * @param {string} token The current token
     *
     * @private
     */
    _parseShortOption(token) {
        const name = token.substr(1);

        if (1 < name.length) {
            if (this._definition.hasShortcut(name[0]) && this._definition.getOptionForShortcut(name[0]).acceptValue()) {
                // An option with a value (with no space)
                this._addShortOption(name[0], name.substr(1));
            } else {
                this._parseShortOptionSet(name);
            }
        } else {
            this._addShortOption(name, null);
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
     * Parses a short option set.
     *
     * @param {string} name The current token
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidOptionException} When option given doesn't exist
     *
     * @private
     */
    _parseShortOptionSet(name) {
        const length = name.length;
        for (let i = 0; i < length; ++i) {
            if (! this._definition.hasShortcut(name[i])) {
                throw new InvalidOptionException(`The "-${name[i]}" option does not exist.`);
            }

            const option = this._definition.getOptionForShortcut(name[i]);
            if (option.acceptValue()) {
                this._addLongOption(option.getName(), i === length - 1 ? undefined : name.substr(i + 1));
                break;
            } else {
                this._addLongOption(option.getName(), undefined);
            }
        }
    }
}

module.exports = ArgvInput;
