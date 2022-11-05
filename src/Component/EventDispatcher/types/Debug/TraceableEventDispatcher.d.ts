declare namespace Jymfony.Component.EventDispatcher.Debug {
    import Event = Jymfony.Contracts.EventDispatcher.Event;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import StopwatchInterface = Jymfony.Contracts.Stopwatch.StopwatchInterface;

    export class TraceableEventDispatcher extends implementationOf(TraceableEventDispatcherInterface) {
        /**
         * @inheritdoc
         */
        public readonly calledListeners: IterableIterator<[string, Set<Invokable<any>>]>;

        /**
         * @inheritdoc
         */
        public readonly notCalledListeners: IterableIterator<[string, Set<Invokable<any>>]>;

        protected _stopwatch: StopwatchInterface;
        private _dispatcher: EventDispatcherInterface;
        private _logger?: LoggerInterface;

        private _called: Record<string, Set<Invokable<any>>>;

        /**
         * Constructor.
         */
        __construct(dispatcher: EventDispatcherInterface, stopwatch: StopwatchInterface, logger?: LoggerInterface): void;
        constructor(dispatcher: EventDispatcherInterface, stopwatch: StopwatchInterface, logger?: LoggerInterface);

        /**
         * @inheritdoc
         */
        dispatch<T extends object>(event: T, eventName?: string|Newable): Promise<T>;

        /**
         * Called before dispatching an event.
         */
        protected _preDispatch(eventName: string, event: object): void;

        /**
         * Called after dispatching an event.
         */
        protected _postDispatch(eventName: string, event: object): void;

        /**
         * Wrap event listeners to track calls.
         */
        private _preProcess(eventName: string): void;

        /**
         * Events post-processing.
         */
        private _postProcess(eventName: string): void;
    }
}
