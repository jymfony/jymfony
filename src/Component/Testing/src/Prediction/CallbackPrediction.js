const PredictionInterface = Jymfony.Component.Testing.Prediction.PredictionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Prediction
 */
class CallbackPrediction extends implementationOf(PredictionInterface) {
    __construct(callback) {
        if (! isFunction(callback)) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'Callable expected as an argument to CallbackPrediction, but got %s.',
                typeof callback
            ));
        }

        this._callback = callback;
    }

    /**
     * @inheritDoc
     */
    check(calls, object, method) {
        const cb = new BoundFunction(object, this._callback);

        return cb(calls, object, method);
    }
}

module.exports = CallbackPrediction;
