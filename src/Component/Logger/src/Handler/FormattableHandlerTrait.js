/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class FormattableHandlerTrait {
    /**
     * Constructor.
     */
    __construct() {
        this._formatter = undefined;
    }

    /**
     * Set the formatter.
     *
     * @param {Jymfony.Component.Logger.Formatter.FormatterInterface} formatter
     */
    set formatter(formatter) {
        this._formatter = formatter;
    }

    /**
     * Get the formatter.
     *
     * @returns {Jymfony.Component.Logger.Formatter.FormatterInterface}
     */
    get formatter() {
        if (undefined === this._formatter) {
            this._formatter = this.getDefaultFormatter();
        }

        return this._formatter;
    }
}

module.exports = getTrait(FormattableHandlerTrait);
