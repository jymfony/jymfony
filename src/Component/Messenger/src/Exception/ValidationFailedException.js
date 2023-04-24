const RuntimeException = Jymfony.Component.Messenger.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class ValidationFailedException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {object} violatingMessage
     * @param {Jymfony.Component.Validator.ConstraintViolationListInterface} violations
     */
    __construct(violatingMessage, violations) {
        /**
         * @type {object}
         *
         * @private
         */
        this._violatingMessage = violatingMessage;

        /**
         * @type {Jymfony.Component.Validator.ConstraintViolationListInterface}
         *
         * @private
         */
        this._violations = violations;

        super.__construct(__jymfony.sprintf('Message of type "%s" failed validation.', ReflectionClass.getClassName(this._violatingMessage)));
    }

    get violatingMessage() {
        return this._violatingMessage;
    }

    get violations() {
        return this._violations;
    }
}
