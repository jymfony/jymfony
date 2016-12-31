/**
 * @memberOf Jymfony.Console.Output
 * @type OutputInterface
 *
 * @interface
 */
class OutputInterface {
    /**
     * Writes a message to the output.
     *
     * @param {string|string[]} messages The message as an array of lines or a single string
     * @param {boolean} newline  Whether to add a newline
     * @param {int} options  A bitmask of options (one of the OUTPUT or VERBOSITY constants), 0 is considered the same as self::OUTPUT_NORMAL | self::VERBOSITY_NORMAL
     */
    write(messages, newline = false, options = 0) { }

    /**
     * Writes a message to the output and adds a newline at the end.
     *
     * @param {string|string[]} messages The message as an array of lines of a single string
     * @param {int} options  A bitmask of options (one of the OUTPUT or VERBOSITY constants), 0 is considered the same as self::OUTPUT_NORMAL | self::VERBOSITY_NORMAL
     */
    writeln(messages, options = 0) { }

    /**
     * Sets the verbosity of the output.
     *
     * @param {int} level The level of verbosity (one of the VERBOSITY constants)
     */
    set verbosity(level) { }

    /**
     * Gets the current verbosity of the output.
     *
     * @returns {int} The current level of verbosity (one of the VERBOSITY constants)
     */
    get verbosity() { }

    /**
     * Returns whether verbosity is quiet (-q).
     *
     * @returns {boolean} true if verbosity is set to VERBOSITY_QUIET, false otherwise
     */
    isQuiet() { }

    /**
     * Returns whether verbosity is verbose (-v).
     *
     * @returns {boolean} true if verbosity is set to VERBOSITY_VERBOSE, false otherwise
     */
    isVerbose() { }

    /**
     * Returns whether verbosity is very verbose (-vv).
     *
     * @returns {boolean} true if verbosity is set to VERBOSITY_VERY_VERBOSE, false otherwise
     */
    isVeryVerbose() { }

    /**
     * Returns whether verbosity is debug (-vvv).
     *
     * @returns {boolean} true if verbosity is set to VERBOSITY_DEBUG, false otherwise
     */
    isDebug() { }

    /**
     * Sets the decorated flag.
     *
     * @param {boolean} decorated Whether to decorate the messages
     */
    set decorated(decorated) { }

    /**
     * Gets the decorated flag.
     *
     * @returns {boolean} true if the output will decorate messages, false otherwise
     */
    get decorated() { }

    /**
     * Sets output formatter.
     *
     * @param {Jymfony.Console.Formatter.OutputFormatterInterface} formatter
     */
    set formatter(formatter) { }

    /**
     * Returns current output formatter instance.
     *
     * @returns {Jymfony.Console.Formatter.OutputFormatterInterface}
     */
    get formatter() { }
}

OutputInterface.VERBOSITY_QUIET = 16;
OutputInterface.VERBOSITY_NORMAL = 32;
OutputInterface.VERBOSITY_VERBOSE = 64;
OutputInterface.VERBOSITY_VERY_VERBOSE = 128;
OutputInterface.VERBOSITY_DEBUG = 256;

OutputInterface.OUTPUT_NORMAL = 1;
OutputInterface.OUTPUT_RAW = 2;
OutputInterface.OUTPUT_PLAIN = 4;

module.exports = getInterface(OutputInterface);
