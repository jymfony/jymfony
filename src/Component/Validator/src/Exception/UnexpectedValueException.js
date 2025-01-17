const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class UnexpectedValueException extends UnexpectedTypeException {
    /**
     * @type {string}
     *
     * @private
     */
    _expectedType;

    /**
     * Constructor.
     *
     * @param {*} value
     * @param {string|Newable} expectedType
     */
    __construct(value, expectedType) {
        super.__construct(value, expectedType);
        this._expectedType = isString(expectedType) ? expectedType : ReflectionClass.getClassName(expectedType);
    }

    /**
     * @returns {string}
     */
    get expectedType() {
        return this._expectedType;
    }
}
