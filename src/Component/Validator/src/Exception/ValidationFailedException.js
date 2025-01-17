const RuntimeException = Jymfony.Component.Validator.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class ValidationFailedException extends RuntimeException {
    /**
     * @type {Jymfony.Component.Validator.ConstraintViolationListInterface}
     *
     * @private
     */
    _violations;

    /**
     * @type {*}
     *
     * @private
     */
    _value;

    /**
     * Constructor.
     *
     * @param {*} value
     * @param {Jymfony.Component.Validator.ConstraintViolationListInterface} violations
     */
    __construct(value, violations) {
        this._violations = violations;
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
