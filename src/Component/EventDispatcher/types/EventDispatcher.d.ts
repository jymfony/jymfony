declare namespace Jymfony.Component.EventDispatcher {
    interface ListenerDescriptor {
        listener: Invokable<any>|[object|string, string|symbol];
        priority: number;
    }

    export class EventDispatcher extends implementationOf(EventDispatcherInterface) {
        /**
         * Listeners map.
         */
        private _listeners: Record<string, ListenerDescriptor[]>;

        /**
         * Listeners map sorted by priority.
         */
        private _sorted: Record<string, ListenerDescriptor[]>;

        /**
         * Constructor.
         */
        __construct(): void;

        /**
         * @inheritdoc
         */
        dispatch(eventName: string, event?: Event): Promise<Event>;

        /**
         * @inheritdoc
         */
        getListeners(eventName?: string): IterableIterator<Invokable>;

        /**
         * @inheritdoc
         */
        addListener(eventName: string, listener: Invokable|[object|string, string|symbol], priority?: number): void;

        /**
         * @inheritdoc
         */
        hasListeners(eventName: string): boolean;

        /**
         * @inheritdoc
         */
        removeListener(eventName: string, listener: Invokable|[object|string, string|symbol]): void;

        /**
         * @inheritdoc
         */
        addSubscriber(subscriber: EventSubscriberInterface): void;

        /**
         * @inheritdoc
         */
        removeSubscriber(subscriber: EventSubscriberInterface): void;

        /**
         * @inheritdoc
         */
        getListenerPriority(eventName: string, listener: Invokable|[object|string, string|symbol]): undefined|number;

        /**
         * Sorts the array of listeners based on priority.
         */
        private _sortListeners(eventName: string): void;

        private static _funcEquals(func1: Invokable<any>, func2: Invokable<any>): void;
    }
}
