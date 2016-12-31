/**
 * @memberOf Jymfony.Console.Formatter
 * @type OutputFormatterStyleInterface
 *
 * @interface
 */
class OutputFormatterStyleInterface {
    /**
     * Sets style foreground color.
     *
     * @param {string} color The color name
     */
    set foreground(color) { }

    /**
     * Sets style background color.
     *
     * @param {string} color The color name
     */
    set background(color) { }

    /**
     * Sets some specific style option.
     *
     * @param {string} option The option name
     */
    setOption(option) { }

    /**
     * Unsets some specific style option.
     *
     * @param {string} option The option name
     */
    unsetOption(option) { }

    /**
     * Sets multiple style options at once.
     *
     * @param {Array} options
     */
    setOptions(options) { }

    /**
     * Applies the style to a given text.
     *
     * @param {string} text The text to style
     *
     * @returns {string}
     */
    apply(text) { }
}

module.exports = getInterface(OutputFormatterStyleInterface);
