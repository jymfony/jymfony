declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * Execute the inner middleware according to an activation strategy.
     */
    export class ActivationMiddleware extends implementationOf(MiddlewareInterface) {
        private _inner: MiddlewareInterface;
        private _activated: boolean | ((envelope: Envelope) => Promise<Envelope>);

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.Messenger.Middleware.MiddlewareInterface} inner
         * @param {(function(Envelope): Promise<Envelope>) | boolean} activated
         */
        __construct(inner: MiddlewareInterface, activated: ((envelope: Envelope) => Promise<Envelope>) | boolean): void;
        constructor(inner: MiddlewareInterface, activated: ((envelope: Envelope) => Promise<Envelope>) | boolean);

        /**
         * @inheritdoc
         */
        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope>;
    }
}
