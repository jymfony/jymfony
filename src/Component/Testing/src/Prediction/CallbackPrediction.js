const PredictionInterface = Jymfony.Component.Testing.Prediction.PredictionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Prediction
 */
export default class CallbackPrediction extends implementationOf(PredictionInterface) {
    /**
     * Constructor.
     *
     * @param {Function} callback
     */
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
     * @inheritdoc
     */
    check(calls, object, method) {
        const cb = new BoundFunction(object, this._callback);

        return cb(calls, object, method);
    }
}
