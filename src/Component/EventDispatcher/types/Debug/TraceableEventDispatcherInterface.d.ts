declare namespace Jymfony.Component.EventDispatcher.Debug {
    export class TraceableEventDispatcherInterface {
        /**
         * Gets the called listeners.
         *
         * @returns An array of called listeners
         */
        public readonly calledListeners: IterableIterator<[string, Set<Invokable<any>>]>;

        /**
         * Gets the not called listeners.
         */
        public readonly notCalledListeners: IterableIterator<[string, Set<Invokable<any>>]>;
    }
}
