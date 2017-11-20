/**
 * @memberOf Jymfony.Component.Console.Formatter
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
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface} style The style instance
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
     * @returns {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface}
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

    /**
     * Formats a message according to the given styles, wrapping at `width` (0 means no wrapping).
     *
     * @param {string} message The message to style
     * @param {int} width Wrap limit (0 means no wrapping)
     *
     * @returns {string} The styled message
     */
    formatAndWrap(message, width) { }
}

export default getInterface(OutputFormatterInterface);
