const NoCallsException = Jymfony.Component.Testing.Exception.Prediction.NoCallsException;
const PredictionInterface = Jymfony.Component.Testing.Prediction.PredictionInterface;
const Argument = Jymfony.Component.Testing.Argument;
const AnyValuesToken = Jymfony.Component.Testing.Argument.Token.AnyValuesToken;

/**
 * @memberOf Jymfony.Component.Testing.Prediction
 */
export default class CallPrediction extends implementationOf(PredictionInterface) {
    /**
     * @inheritdoc
     */
    check(calls, object, method) {
        if (calls.length) {
            return;
        }

        const methodCalls = object.findProphecyMethodCalls(
            method.methodName,
            new Argument.ArgumentsWildcard([ new AnyValuesToken() ])
        );

        if (methodCalls.length) {
            throw new NoCallsException(__jymfony.sprintf(
                'No calls have been made that match:\n' +
                '  %s.%s(%s)\n' +
                'but expected at least one.\n' +
                'Recorded `%s(...)` calls:\n%s',
                object.name,
                method.methodName,
                method.argumentsWildcard,
                method.methodName,
                methodCalls.map(call => call.toString()).join(', ')
            ), method);
        }

        throw new NoCallsException(__jymfony.sprintf(
            'No calls have been made that match:\n' +
            '  %s.%s(%s)\n' +
            'but expected at least one.',
            object.name,
            method.methodName,
            method.argumentsWildcard
        ), method);
    }
}
