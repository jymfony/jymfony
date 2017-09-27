/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class FormattableHandlerTrait {
    set formatter(formatter) {
        this._formatter = formatter;
    }

    get formatter() {
        if (undefined === this._formatter) {
            this._formatter = this.getDefaultFormatter();
        }

        return this._formatter;
    }
}

module.exports = getTrait(FormattableHandlerTrait);
