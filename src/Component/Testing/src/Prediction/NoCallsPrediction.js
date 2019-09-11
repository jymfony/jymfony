const UnexpectedCallsException = Jymfony.Component.Testing.Exception.Prediction.UnexpectedCallsException;
const PredictionInterface = Jymfony.Component.Testing.Prediction.PredictionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Prediction
 */
export default class NoCallsPrediction extends implementationOf(PredictionInterface) {
    /**
     * @inheritdoc
     */
    check(calls, object, method) {
        if (0 === calls.length) {
            return;
        }

        const verb = 1 === calls.length ? 'was' : 'were';

        throw new UnexpectedCallsException(__jymfony.sprintf(
            'No calls expected that match:\n' +
            '  %s.%s(%s)\n' +
            'but %d %s made:\n%s',
            (new ReflectionClass(object.reveal())).name,
            method.methodName,
            method.argumentsWildcard,
            calls.length,
            verb,
            calls.map(call => call.toString())
        ), method, calls);
    }
}
