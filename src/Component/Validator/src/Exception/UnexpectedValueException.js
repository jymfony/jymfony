const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class UnexpectedValueException extends UnexpectedTypeException {
    /**
     * Constructor.
     *
     * @param {*} value
     * @param {string|Newable} expectedType
     */
    __construct(value, expectedType) {
        super.__construct(value, expectedType);

        /**
         * @type {string}
         *
         * @private
         */
        this._expectedType = isString(expectedType) ? expectedType : ReflectionClass.getClassName(expectedType);
    }

    /**
     * @returns {string}
     */
    get expectedType() {
        return this._expectedType;
    }
}
