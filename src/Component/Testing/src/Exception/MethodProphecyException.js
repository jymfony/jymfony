const ObjectProphecyException = Jymfony.Component.Testing.Exception.ObjectProphecyException;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
class MethodProphecyException extends ObjectProphecyException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.MethodProphecy} methodProphecy
     */
    constructor(message, methodProphecy) {
        super(message, methodProphecy.objectProphecy);

        this._methodProphecy = methodProphecy;
    }

    /**
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    get methodProphecy() {
        return this._methodProphecy;
    }
}

module.exports = MethodProphecyException;
