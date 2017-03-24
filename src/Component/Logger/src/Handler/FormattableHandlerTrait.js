/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class FormattableHandlerTrait {
    set formatter(formatter) {
        this._formatter = formatter;
    }

    get formatter() {
        return this._formatter;
    }
}

module.exports = getTrait(FormattableHandlerTrait);
