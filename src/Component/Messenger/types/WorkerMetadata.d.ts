declare namespace Jymfony.Component.Messenger {
    export class WorkerMetadata {
        private _metadata: Record<string, any>;

        /**
         * Constructor.
         */
        __construct(metadata: Record<string, any>): void;
        constructor(metadata: Record<string, any>);

        set(newMetadata: Record<string, any>): void;

        /**
         * Returns the queue names the worker consumes from, if "--queues" option was used.
         * Returns null otherwise.
         */
        public readonly queueNames: string[] | null;

        /**
         * Returns an array of unique identifiers for transport receivers the worker consumes from.
         */
        public readonly transportNames: string[] | null;
    }
}
