const MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
export default class UnexpectedCallsException extends MethodProphecyException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.MethodProphecy} methodProphecy
     * @param {string[]} calls
     */
    __construct(message, methodProphecy, calls) {
        super.__construct(message, methodProphecy);

        /**
         * @type {string[]}
         *
         * @private
         */
        this._calls = calls;
    }

    /**
     * @returns {string[]}
     */
    get calls() {
        return [ ...this._calls ];
    }
}
