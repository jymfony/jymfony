/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class FormattableHandlerInterface {
    /**
     * Sets the formatter.
     *
     * @param {Jymfony.Component.Logger.Formatter.FormatterInterface} formatter
     */
    set formatter(formatter) { }

    /**
     * Gets the formatter.
     *
     * @returns {Jymfony.Component.Logger.Formatter.FormatterInterface}
     */
    get formatter() { }
}

module.exports = getInterface(FormattableHandlerInterface);
