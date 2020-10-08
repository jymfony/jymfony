const RuntimeException = Jymfony.Component.Validator.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class ValidationFailedException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {*} value
     * @param {Jymfony.Component.Validator.ConstraintViolationListInterface} violations
     */
    __construct(value, violations) {
        /**
         * @type {Jymfony.Component.Validator.ConstraintViolationListInterface}
         *
         * @private
         */
        this._violations = violations;

        /**
         * @type {*}
         *
         * @private
         */
        this._value = value;

        super.__construct(violations);
    }

    /**
     * Gets the invalid value.
     *
     * @returns {*}
     */
    get value() {
        return this._value;
    }

    /**
     * Gets the violation list.
     *
     * @returns {Jymfony.Component.Validator.ConstraintViolationListInterface}
     */
    get violations() {
        return this._violations;
    }
}
