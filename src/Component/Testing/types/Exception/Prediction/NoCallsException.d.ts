declare namespace Jymfony.Component.Testing.Exception.Prediction {
    import MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;

    export class NoCallsException extends mix(MethodProphecyException, PredictionException) {
    }
}
