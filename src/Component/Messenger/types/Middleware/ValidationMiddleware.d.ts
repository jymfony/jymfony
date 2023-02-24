declare namespace Jymfony.Component.Messenger.Middleware {
    import MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import StackInterface = Jymfony.Component.Messenger.Middleware.StackInterface;

    export class ValidationMiddleware extends implementationOf(MiddlewareInterface) {
        private _validator: unknown;

        /**
         * Constructor.
         */
        __construct(validator: unknown): void;
        constructor(validator: unknown);

        /**
         * @inheritdoc
         */
        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope>;
    }
}
