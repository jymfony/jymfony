declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    export class StackMiddleware extends implementationOf(MiddlewareInterface, StackInterface) {
        private _stack: MiddlewareInterface[];

        /**
         * Constructor.
         */
        __construct(middlewares?: MiddlewareInterface[]): void;
        constructor(middlewares?: MiddlewareInterface[]);

        next(): MiddlewareInterface;

        handle(envelope: Envelope): Envelope;
    }
}
