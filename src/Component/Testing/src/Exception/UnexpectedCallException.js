const ObjectProphecyException = Jymfony.Component.Testing.Exception.ObjectProphecyException;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
class UnexpectedCallException extends ObjectProphecyException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} objectProphecy
     * @param {string} methodName
     * @param {[*]} args
     */
    __construct(message, objectProphecy, methodName, args) {
        super.__construct(message, objectProphecy);

        this._methodName = methodName;
        this._args = args;
    }

    get methodName() {
        return this._methodName;
    }

    get args() {
        return this._args;
    }
}

module.exports = UnexpectedCallException;
