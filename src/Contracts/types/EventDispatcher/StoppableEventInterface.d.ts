declare namespace Jymfony.Contracts.EventDispatcher {
    export class StoppableEventInterface {
        public static readonly definition: Newable<StoppableEventInterface>;

        /**
         * Whether the propagation of the current is has been stopped.
         */
        isPropagationStopped(): boolean;

        /**
         * Immediately stops the propagation of the event.
         */
        stopPropagation(): void;
    }
}
