const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

/**
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class UnexpectedTypeException extends ValidatorException {
    /**
     * Constructor.
     *
     * @param {*} value
     * @param {string|Newable} expectedType
     */
    __construct(value, expectedType) {
        super.__construct(__jymfony.sprintf('Expected argument of type "%s", "%s" given', isString(expectedType) ? expectedType : ReflectionClass.getClassName(expectedType), __jymfony.get_debug_type(value)));
    }
}
