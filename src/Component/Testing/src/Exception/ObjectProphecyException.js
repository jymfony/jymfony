const ExceptionInterface = Jymfony.Component.Testing.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
export default class ObjectProphecyException extends mix(RuntimeException, ExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} objectProphecy
     */
    __construct(message, objectProphecy) {
        super.__construct(message);

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._objectProphecy = objectProphecy;
    }

    /**
     * @returns {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    get objectProphecy() {
        return this._objectProphecy;
    }
}
