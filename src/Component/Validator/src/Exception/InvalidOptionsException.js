const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

/**
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class InvalidOptionsException extends ValidatorException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {string[]} options
     */
    __construct(message, options) {
        super.__construct(message);

        this._options = options;
    }

    get options() {
        return this._options;
    }
}
