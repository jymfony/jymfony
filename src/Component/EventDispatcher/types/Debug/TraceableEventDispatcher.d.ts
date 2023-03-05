declare namespace Jymfony.Component.EventDispatcher.Debug {
    import ClsTrait = Jymfony.Contracts.Async.ClsTrait;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import StopwatchInterface = Jymfony.Contracts.Stopwatch.StopwatchInterface;

    export class TraceableEventDispatcher extends implementationOf(EventDispatcherInterface, ClsTrait) {
        protected _stopwatch: StopwatchInterface;
        private _dispatcher: EventDispatcherInterface;
        private _logger: LoggerInterface;
        private _callStack: WeakMap<object, [ string, WrappedListener ][]>;
        private _wrappedListeners: Record<string, WrappedListener[]>;
        private _orphanedEvents: WeakMap<object, string[]>;

        /**
         * Constructor.
         */
        __construct(dispatcher: EventDispatcherInterface, stopwatch: StopwatchInterface, logger?: LoggerInterface): void;
        constructor(dispatcher: EventDispatcherInterface, stopwatch: StopwatchInterface, logger?: LoggerInterface);

        /**
         * @inheritDoc
         */
        addListener(eventName: string | Newable, listener: Invokable | [object|string, string|symbol], priority?: number): void;

        /**
         * @inheritDoc
         */
        addSubscriber(subscriber: EventSubscriberInterface): void;

        /**
         * @inheritDoc
         */
        removeListener(eventName: string | Newable, listener: Invokable | [object|string, string|symbol]): void;

        /**
         * @inheritDoc
         */
        removeSubscriber(subscriber: EventSubscriberInterface): void;

        /**
         * @inheritDoc
         */
        getListeners(eventName?: string | Newable): IterableIterator<Invokable>;

        /**
         * @inheritDoc
         */
        getListenerPriority(eventName: string | Newable, listener: Invokable | [object|string, string|symbol]): undefined | number;

        /**
         * @inheritDoc
         */
        hasListeners(eventName: string | Newable): boolean;

        /**
         * @inheritdoc
         */
        dispatch<T extends object>(event: T, eventName?: string|Newable): Promise<T>;

        /**
         * @param {Jymfony.Component.HttpFoundation.Request | null} request
         */
        getCalledListeners(request: unknown | null): Record<string, ListenerInfo>[];

        /**
         * @param {Jymfony.Component.HttpFoundation.Request | null} request
         */
        getNotCalledListeners(request: unknown | null): Record<string, ListenerInfo>[];

        /**
         * @param {Jymfony.Component.HttpFoundation.Request | null} request
         */
        getOrphanedEvents(request): string[];

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

        private static _sortNotCalledListeners(a: ListenerInfo, b: ListenerInfo): number;
    }
}
