declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    export class StackMiddleware extends implementationOf(MiddlewareInterface, StackInterface) {
        private _stack: MiddlewareStack;

        /**
         * Constructor.
         */
        __construct(middlewares?: MiddlewareInterface[]): void;
        constructor(middlewares?: MiddlewareInterface[]);

        next(): MiddlewareInterface;

        handle(envelope: Envelope): Envelope;
    }

    class MiddlewareStack {
        iterator: Iterator<MiddlewareInterface>;
        stack: MiddlewareInterface[];

        /**
         * @param {Iterator} iterator
         */
        __construct(iterator?: Iterator<MiddlewareInterface>): void;
        constructor(iterator?: Iterator<MiddlewareInterface>);

        next(offset: number): MiddlewareInterface | null;
    }

}
