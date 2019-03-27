declare namespace Jymfony.Component.EventDispatcher.Debug {
    import Event = Jymfony.Contracts.EventDispatcher.Event;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;

    export class TraceableEventDispatcher extends implementationOf(TraceableEventDispatcherInterface) {
        /**
         * @inheritdoc
         */
        public readonly calledListeners: IterableIterator<[string, Set<Invokable<any>>]>;

        /**
         * @inheritdoc
         */
        public readonly notCalledListeners: IterableIterator<[string, Set<Invokable<any>>]>;

        private _dispatcher: EventDispatcherInterface;

        private _logger?: LoggerInterface;

        private _called: Record<string, Set<Invokable<any>>>;

        /**
         * Constructor.
         */
        __construct(dispatcher: EventDispatcherInterface, logger?: LoggerInterface): void;
        constructor(dispatcher: EventDispatcherInterface, logger?: LoggerInterface);

        /**
         * @inheritdoc
         */
        dispatch(eventName: string, event?: Event): Promise<Event>;

        /**
         * Called before dispatching an event.
         */
        protected _preDispatch(eventName: string, event: Event): void;

        /**
         * Called after dispatching an event.
         */
        protected _postDispatch(eventName: string, event: Event): void;

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
