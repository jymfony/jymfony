/**
 * Stamp identifying a message handled by the `HandleMessageMiddleware` middleware
 * and storing the handler returned value.
 *
 * This is used by synchronous command buses expecting a return value and the retry logic
 * to only execute handlers that didn't succeed.
 *
 * @see Jymfony.Component.Messenger.Middleware.HandleMessageMiddleware
 * @see Jymfony.Component.Messenger.HandleTrait
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 */
export default class HandledStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {*} result
     * @param {string} handlerName
     */
    __construct(result, handlerName) {
        /**
         * @type {*}
         *
         * @private
         */
        this._result = result;

        /**
         * @type {string}
         *
         * @private
         */
        this._handlerName = handlerName;
    }

    /**
     * @param {Jymfony.Component.Messenger.Handler.HandlerDescriptor} handler
     * @param {*} result
     *
     * @returns {Jymfony.Component.Messenger.Stamp.HandledStamp}
     */
    static fromDescriptor(handler, result) {
        return new __self(result, handler.name);
    }

    get result() {
        return this._result;
    }

    get handlerName() {
        return this._handlerName;
    }
}
