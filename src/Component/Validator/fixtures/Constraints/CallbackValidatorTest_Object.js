/**
 * @memberOf Jymfony.Component.Validator.Fixtures.Constraints
 */
export default class CallbackValidatorTest_Object {
    /**
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     *
     * @returns {boolean}
     */
    validate(context) {
        context.addViolation('My message', {'{{ value }}': 'foobar'});

        return false;
    }

    /**
     * @param {*} object
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     *
     * @returns {boolean}
     */
    static validateStatic(object, context) {
        context.addViolation('Static message', {'{{ value }}': 'baz'});

        return false;
    }
}
