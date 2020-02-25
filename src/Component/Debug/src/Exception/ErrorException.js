/**
 * @memberOf Jymfony.Component.Debug.Exception
 */
export default class ErrorException extends Exception {
    __construct(message, code = null, severity = 'Warning') {
        super.__construct(message, code);

        /**
         * @type {string}
         *
         * @private
         */
        this._severity = severity;
    }

    /**
     * Gets the error severity.
     *
     * @returns {string}
     */
    get severity() {
        return this._severity;
    }
}
