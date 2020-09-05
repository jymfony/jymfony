/**
 * @memberOf Jymfony.Component.Validator.Fixtures.Constraints
 */
export default class CallbackValidatorTest_Class {
    /**
     * @param {*} object
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     *
     * @returns {boolean}
     */
    static validateCallback(object, context) {
        context.addViolation('Callback message', {'{{ value }}': 'foobar'});

        return false;
    }
}
