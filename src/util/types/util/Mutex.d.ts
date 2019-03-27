declare namespace __jymfony {
    /**
     * Provide exclusive locking.
     */
    export class Mutex {
        private _queue: Invokable[];
        private _pending: boolean;

        /**
         * Whether the mutex is locked.
         */
        public readonly locked: boolean;

        constructor();

        /**
         * Acquires the lock.
         * Use `await` to wait for lock to be available.
         */
        acquire(): Promise<Mutex>;

        /**
         * Runs task exclusively.
         *
         * @param {Function} callback
         *
         * @returns {Promise<*>}
         */
        runExclusive<T = any>(callback: Invokable<T>): Promise<T>;

        /**
         * Releases the mutex.
         */
        release(): void;

        /**
         * Unfreeze the next task in queue.
         */
        private _dispatchNext(): void;
    }
}
