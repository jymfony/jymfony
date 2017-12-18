const MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
class UnexpectedCallsException extends MethodProphecyException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.MethodProphecy} methodProphecy
     * @param {[*]} calls
     */
    constructor(message, methodProphecy, calls) {
        super(message, methodProphecy);
        this._calls = calls;
    }

    get calls() {
        return [ ...this._calls ];
    }
}

module.exports = UnexpectedCallsException;
