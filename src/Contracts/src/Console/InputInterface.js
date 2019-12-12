/**
 * @memberOf Jymfony.Contracts.Console
 *
 * @interface
 */
class InputInterface {
    /**
     * Returns all the given arguments merged with the default values.
     *
     * @returns {Array}
     */
    get arguments() { }

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

    /**
     * Returns all the given options merged with the default values.
     *
     * @returns {Array}
     */
    get options() { }
    /**
     * Returns the argument value for a given argument name.
     *
     * @param {string} name The argument name
     *
     * @returns {*} The argument value
     *
     * @throws {InvalidArgumentException} When argument given doesn't exist
     */
    getArgument(name) { }

    /**
     * Sets an argument value by name.
     *
     * @param {string} name  The argument name
     * @param {string} value The argument value
     *
     * @throws {InvalidArgumentException} When argument given doesn't exist
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
     * Returns the option value for a given option name.
     *
     * @param {string} name The option name
     *
     * @returns {*} The option value
     *
     * @throws {InvalidArgumentException} When option given doesn't exist
     */
    getOption(name) { }

    /**
     * Sets an option value by name.
     *
     * @param {string} name The option name
     * @param {string|boolean} value The option value
     *
     * @throws {InvalidArgumentException} When option given doesn't exist
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
}

export default getInterface(InputInterface);
