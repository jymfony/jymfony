const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;

/**
 * Execute the inner middleware according to an activation strategy.
 *
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class ActivationMiddleware extends implementationOf(MiddlewareInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Middleware.MiddlewareInterface} inner
     * @param {(function(Envelope): Promise<Envelope>) | boolean} activated
     */
    __construct(inner, activated) {
        /**
         * @type {Jymfony.Component.Messenger.Middleware.MiddlewareInterface}
         *
         * @private
         */
        this._inner = inner;

        /**
         * @type {(function(Jymfony.Component.Messenger.Envelope): Promise<Jymfony.Component.Messenger.Envelope>) | boolean}
         *
         * @private
         */
        this._activated = activated;
    }

    /**
     * @inheritdoc
     */
    async handle(envelope, stack) {
        if (isFunction(this._activated) ? await this._activated(envelope) : this._activated) {
            return await this._inner.handle(envelope, stack);
        }

        return await stack.next().handle(envelope, stack);
    }
}
