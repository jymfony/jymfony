const MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;
const PredictionException = Jymfony.Component.Testing.Exception.Prediction.PredictionException;

/**
 * @memberOf Jymfony.Component.Testing.Exception.Prediction
 */
export default class NoCallsException extends mix(MethodProphecyException, PredictionException) {
}
