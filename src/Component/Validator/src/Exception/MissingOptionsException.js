const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

/**
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class MissingOptionsException extends ValidatorException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {*} options
     */
    __construct(message, options) {
        super.__construct(message);

        this._options = options;
    }

    get options() {
        return this._options;
    }
}
