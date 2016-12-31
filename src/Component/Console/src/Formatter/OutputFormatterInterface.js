/**
 * @memberOf Jymfony.Console.Formatter
 * @type OutputFormatterInterface
 *
 * @interface
 */
class OutputFormatterInterface {
    /**
     * Sets the decorated flag.
     *
     * @param {boolean} decorated Whether to decorate the messages or not
     */
    set decorated(decorated) { }

    /**
     * Gets the decorated flag.
     *
     * @returns {boolean} true if the output will decorate messages, false otherwise
     */
    get decorated() { }

    /**
     * Sets a new style.
     *
     * @param {string} name  The style name
     * @param {Jymfony.Console.Formatter.OutputFormatterStyleInterface} style The style instance
     */
    setStyle(name, style) { }

    /**
     * Checks if output formatter has style with specified name.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasStyle(name) { }

    /**
     * Gets style options from style with specified name.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Console.Formatter.OutputFormatterStyleInterface}
     */
    getStyle(name) { }

    /**
     * Formats a message according to the given styles.
     *
     * @param {string} message The message to style
     *
     * @returns {string} The styled message
     */
    format(message) { }
}

module.exports = getInterface(OutputFormatterInterface);
