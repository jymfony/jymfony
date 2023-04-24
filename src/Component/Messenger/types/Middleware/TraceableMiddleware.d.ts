declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
    import StackInterface = Jymfony.Component.Messenger.Middleware.StackInterface;
    import StopwatchInterface = Jymfony.Contracts.Stopwatch.StopwatchInterface;

    /**
     * Collects some data about a middleware.
     */
    export class TraceableMiddleware extends implementationOf(MiddlewareInterface) {
        private _stopwatch: StopwatchInterface;
        private _busName: string;
        private _eventCategory: string;

        /**
         * Constructor.
         */
        __construct(stopwatch: StopwatchInterface, busName: string, eventCategory?: string): void;
        constructor(stopwatch: StopwatchInterface, busName: string, eventCategory?: string);

        /**
         * {@inheritdoc}
         */
        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope> | Envelope;
    }
}
