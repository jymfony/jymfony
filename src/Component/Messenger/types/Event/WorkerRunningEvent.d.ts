declare namespace Jymfony.Component.Messenger.Event {
    import Worker = Jymfony.Component.Messenger.Worker;

    /**
     * Dispatched after the worker processed a message or didn't receive a message at all.
     *
     * @final
     */
    export class WorkerRunningEvent {
        private _worker: Worker;
        private _isWorkerIdle: boolean;

        /**
         * Constructor.
         */
        __construct(worker: Worker, isWorkerIdle: boolean): void;
        constructor(worker: Worker, isWorkerIdle: boolean);

        public readonly worker: Worker;

        /**
         * Returns true when no message has been received by the worker.
         */
        public readonly isWorkerIdle: boolean;
    }
}
