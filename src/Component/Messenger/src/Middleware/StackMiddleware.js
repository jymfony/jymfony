const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const StackInterface = Jymfony.Component.Messenger.Middleware.StackInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class StackMiddleware extends implementationOf(MiddlewareInterface, StackInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Middleware.MiddlewareInterface[]} middlewares
     */
    __construct(middlewares = []) {
        /**
         * @type {Jymfony.Component.Messenger.Middleware.MiddlewareInterface[]}
         *
         * @private
         */
        this._stack = [ ...middlewares ];
    }

    next() {
        const next = this._stack.pop();
        if (undefined === next) {
            return this;
        }

        return next;
    }

    handle(envelope) {
        return envelope;
    }
}
