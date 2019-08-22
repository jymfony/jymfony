const Argument = Jymfony.Component.Testing.Argument;
const UnexpectedCallsCountException = Jymfony.Component.Testing.Exception.UnexpectedCallsCountException;
const PredictionInterface = Jymfony.Component.Testing.Prediction.PredictionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Prediction
 */
export default class CallTimesPrediction extends implementationOf(PredictionInterface) {
    /**
     * Constructor.
     *
     * @param {int} times
     */
    __construct(times) {
        this._times = ~~times;
    }

    /**
     * @inheritdoc
     */
    check(calls, object, method) {
        if (this._times === calls.length) {
            return;
        }

        const methodCalls = object.findProphecyMethodCalls(
            method.methodName,
            new Argument.ArgumentsWildcard([ Argument.Argument.cetera() ])
        );

        let message;
        if (calls.length) {
            message = __jymfony.sprintf(
                'Expected exactly %d calls that match:\n' +
                '  %s(%s)\n' +
                'but %d were made:\n%s',
                this._times,
                method.methodName,
                method.argumentsWildcard,
                calls.length,
                methodCalls.map(call => call.toString()).join(', ')
            );
        } else if (methodCalls.length) {
            message = __jymfony.sprintf(
                'Expected exactly %d calls that match:\n' +
                '  %s(%s)\n' +
                'but none were made.\n' +
                'Recorded `%s(...)` calls:\n%s',
                this._times,
                method.methodName,
                method.argumentsWildcard,
                method.methodName,
                methodCalls.map(call => call.toString()).join(', ')
            );
        } else {
            message = __jymfony.sprintf(
                'Expected exactly %d calls that match:\n' +
                '  %s(%s)\n' +
                'but none were made.',
                this._times,
                method.methodName,
                method.argumentsWildcard
            );
        }

        throw new UnexpectedCallsCountException(message, method, this._times, calls);
    }
}
