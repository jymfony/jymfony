declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;

    /**
     * Adds the BusNameStamp to the bus.
     */
    export class AddBusNameStampMiddleware extends implementationOf(MiddlewareInterface) {
        private _busName: string;

        /**
         * Constructor.
         */
        __construct(busName: string): void;
        constructor(busName: string);

        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope> | Envelope;
    }
}
