const ExceptionInterface = Jymfony.Component.Testing.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
class ObjectProphecyException extends mix(RuntimeException, ExceptionInterface) {
    __construct(message, objectProphecy) {
        super.__construct(message);

        this._objectProphecy = objectProphecy;
    }

    get objectProphecy() {
        return this._objectProphecy;
    }
}

module.exports = ObjectProphecyException;
