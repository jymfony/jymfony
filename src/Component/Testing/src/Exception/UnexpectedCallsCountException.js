const UnexpectedCallsException = Jymfony.Component.Testing.Exception.UnexpectedCallsException;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
export default class UnexpectedCallsCountException extends UnexpectedCallsException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.MethodProphecy} methodProphecy
     * @param {int} count
     * @param {*[]} calls
     */
    __construct(message, methodProphecy, count, calls) {
        super.__construct(message, methodProphecy, calls);

        /**
         * @type {int}
         *
         * @private
         */
        this._expectedCount = ~~count;
    }

    /**
     * @returns {int}
     */
    get expectedCount() {
        return this._expectedCount;
    }
}
