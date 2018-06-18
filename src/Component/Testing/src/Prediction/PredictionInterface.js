/**
 * @memberOf Jymfony.Component.Testing.Prediction
 */
class PredictionInterface {
    /**
     * Tests that double fulfilled prediction.
     *
     * @param {Jymfony.Component.Testing.Call.Call[]} calls
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} object
     * @param {Jymfony.Component.Testing.Prophecy.MethodProphecy} method
     *
     * @throws {Jymfony.Component.Testing.Exception.ExceptionInterface}
     */
    check(calls, object, method) { }
}

module.exports = getInterface(PredictionInterface);
