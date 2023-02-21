declare namespace Jymfony.Component.Messenger.Event {
    import Worker = Jymfony.Component.Messenger.Worker;

    /**
     * Dispatched when a worker has been started.
     */
    export class WorkerStartedEvent {
        private _worker: Worker;

        /**
         * Constructor.
         */
        __construct(worker: Worker): void;
        constructor(worker: Worker);

        public readonly worker: Worker;
    }
}
