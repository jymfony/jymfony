declare namespace Jymfony.Contracts.EventDispatcher {
    export class EventDispatcherInterface {
        public static readonly definition: Newable<EventDispatcherInterface>;

        /**
         * Dispatches an event.
         * Returns a promise that resolves asynchronously running all the listeners.
         */
        dispatch<T extends object>(event: T, eventName?: string|Newable): Promise<T>;

        /**
         * Attach a listener to an event.
         */
        addListener(eventName: string|Newable, listener: Invokable|[object|string, string|symbol], priority?: number): void;

        /**
         * Adds and event subscriber
         */
        addSubscriber(subscriber: EventSubscriberInterface): void;

        /**
         * Detach a listener.
         */
        removeListener(eventName: string|Newable, listener: Invokable|[object|string, string|symbol]): void;

        /**
         * Detaches all the listeners from a subscriber
         */
        removeSubscriber(subscriber: EventSubscriberInterface): void;

        /**
         * Gets the listeners associated to an event.
         */
        getListeners(eventName?: string|Newable): IterableIterator<Invokable>;

        /**
         * Gets the listener priority for a specific event.
         * Returns undefined if the event or the listener does not exist.
         */
        getListenerPriority(eventName: string|Newable, listener: Invokable|[object|string, string|symbol]): undefined|number;

        /**
         * Whether an event has listeners attached.
         *
         * @returns true if at least one listener is registered, false otherwise
         */
        hasListeners(eventName: string|Newable): boolean;
    }
}
