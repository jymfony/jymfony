const PredictionException = Jymfony.Component.Testing.Exception.Prediction.PredictionException;

/**
 * @memberOf Jymfony.Component.Testing.Exception.Prediction
 */
class AggregateException extends mix(RuntimeException, PredictionException) {
    __construct(message) {
        super.__construct(message);

        this._exceptions = [];
        this.objectProphecy = undefined;
    }

    /**
     * Appends an exception.
     *
     * @param {Error} exception
     */
    append(exception) {
        let message = exception.message || '';
        message = '  ' + message.replace(/\n/g, '\n  ') + '\n';

        this.message = __jymfony.rtrim(this.message + message);
        this._exceptions.push(exception);
    }

    /**
     * @return PredictionException[]
     */
    get exceptions() {
        return this._exceptions;
    }
}

module.exports = AggregateException;
