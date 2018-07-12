/**
 * @memberOf Jymfony.Component.Console.Input
 *
 * @interface
 */
class InputInterface {
    /**
     * Returns the first argument from the raw parameters (not parsed).
     *
     * @returns {string} The value of the first argument or null otherwise
     */
    get firstArgument() { }

    /**
     * Returns true if the raw parameters (not parsed) contain a value.
     *
     * This method is to be used to introspect the input parameters
     * before they have been validated. It must be used carefully.
     *
     * @param {string|string[]} values The values to look for in the raw parameters (can be an array)
     * @param {boolean} [onlyParams = false] Only check real parameters, skip those following an end of options (--) signal
     *
     * @returns {boolean} true if the value is contained in the raw parameters
     */
    hasParameterOption(values, onlyParams = false) { }

    /**
     * Returns the value of a raw option (not parsed).
     *
     * This method is to be used to introspect the input parameters
     * before they have been validated. It must be used carefully.
     *
     * @param {string|string[]} values The value(s) to look for in the raw parameters (can be an array)
     * @param {*} [defaultValue = false] The default value to return if no result is found
     * @param {boolean} [onlyParams = false] Only check real parameters, skip those following an end of options (--) signal
     *
     * @returns {*} The option value
     */
    getParameterOption(values, defaultValue = false, onlyParams = false) { }

    /**
     * Binds the current Input instance with the given arguments and options.
     *
     * @param {Jymfony.Component.Console.Input.InputDefinition} definition A InputDefinition instance
     */
    bind(definition) { }

    /**
     * Validates the input.
     *
     * @throws {Jymfony.Component.Console.Exception.RuntimeException} When not enough arguments are given
     */
    validate() { }

    /**
     * Returns all the given arguments merged with the default values.
     *
     * @returns {Array}
     */
    get arguments() { }

    /**
     * Returns the argument value for a given argument name.
     *
     * @param {string} name The argument name
     *
     * @returns {*} The argument value
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When argument given doesn't exist
     */
    getArgument(name) { }

    /**
     * Sets an argument value by name.
     *
     * @param {string} name  The argument name
     * @param {string} value The argument value
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When argument given doesn't exist
     */
    setArgument(name, value) { }

    /**
     * Returns true if an InputArgument object exists by name or position.
     *
     * @param {string|int} name The InputArgument name or position
     *
     * @returns {boolean} true if the InputArgument object exists, false otherwise
     */
    hasArgument(name) { }

    /**
     * Returns all the given options merged with the default values.
     *
     * @returns {Array}
     */
    get options() { }

    /**
     * Returns the option value for a given option name.
     *
     * @param {string} name The option name
     *
     * @returns {*} The option value
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When option given doesn't exist
     */
    getOption(name) { }

    /**
     * Sets an option value by name.
     *
     * @param {string} name The option name
     * @param {string|boolean} value The option value
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} When option given doesn't exist
     */
    setOption(name, value) { }

    /**
     * Returns true if an InputOption object exists by name.
     *
     * @param {string} name The InputOption name
     *
     * @returns {boolean}
     */
    hasOption(name) { }

    /**
     * Is this input means interactive?
     *
     * @returns {boolean}
     */
    get interactive() { }

    /**
     * Sets the input interactivity.
     *
     * @param {boolean} interactive If the input should be interactive
     */
    set interactive(interactive) { }
}

module.exports = getInterface(InputInterface);
