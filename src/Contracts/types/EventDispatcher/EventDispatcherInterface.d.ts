declare namespace Jymfony.Contracts.EventDispatcher {
    export class EventDispatcherInterface {
        public static readonly definition: Newable<EventDispatcherInterface>;

        /**
         * Dispatches an event.
         * Returns a promise that resolves asynchronously running all
         * the listeners.
         */
        dispatch(eventName: string, event?: Event): Promise<Event>;

        /**
         * Attach a listener to an event.
         */
        addListener(eventName: string, listener: Invokable|[object|string, string|symbol], priority?: number): void;

        /**
         * Adds and event subscriber
         */
        addSubscriber(subscriber: EventSubscriberInterface): void;

        /**
         * Detach a listener.
         */
        removeListener(eventName: string, listener: Invokable|[object|string, string|symbol]): void;

        /**
         * Detaches all the listeners from a subscriber
         */
        removeSubscriber(subscriber: EventSubscriberInterface): void;

        /**
         * Gets the listeners associated to an event.
         */
        getListeners(eventName?: string): IterableIterator<Invokable>;

        /**
         * Gets the listener priority for a specific event.
         * Returns undefined if the event or the listener does not exist.
         */
        getListenerPriority(eventName: string, listener: Invokable|[object|string, string|symbol]): undefined|number;

        /**
         * Whether an event has listeners attached.
         *
         * @returns true if at least one listener is registered, false otherwise
         */
        hasListeners(eventName: string): boolean;
    }
}
