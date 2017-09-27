const ExceptionInterface = Jymfony.Component.Testing.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
class ObjectProphecyException extends mix(RuntimeException, ExceptionInterface) {
    constructor(message, objectProphecy) {
        super(message);

        this._objectProphecy = objectProphecy;
    }

    get objectProphecy() {
        return this._objectProphecy;
    }
}

module.exports = ObjectProphecyException;
