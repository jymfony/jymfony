declare namespace Jymfony.Component.Cache.Traits {
    import LoggerAwareTrait = Jymfony.Contracts.Logger.LoggerAwareTrait;

    export abstract class AbstractAdapterTrait<T = any> extends LoggerAwareTrait.definition {
        public static readonly MAX_ID_LENGTH: number | undefined;

        private _namespace: string | undefined;
        private _namespaceVersion: string | undefined;

        /**
         * Constructor.
         */
        __construct(): void;

        /**
         * Fetches several cache items.
         *
         * @param ids The cache identifiers to fetch
         *
         * @returns The corresponding values found in the cache
         */
        protected abstract _doFetch(ids: string[]): Promise<Record<string, T>>;

        /**
         * Confirms if the cache contains specified cache item.
         *
         * @param id The identifier for which to check existence
         *
         * @returns True if item exists in the cache, false otherwise
         */
        protected abstract _doHave(id: string): Promise<boolean>;

        /**
         * Deletes all items in the pool.
         *
         * @param namespace The prefix used for all identifiers managed by this pool
         *
         * @returns True if the pool was successfully cleared, false otherwise
         */
        protected abstract _doClear(namespace: string): Promise<boolean>;

        /**
         * Removes multiple items from the pool.
         *
         * @param ids An array of identifiers that should be removed from the pool
         *
         * @returns True if the items were successfully removed, false otherwise
         */
        protected abstract _doDelete(ids: string[]): Promise<boolean>;

        /**
         * Persists several cache items immediately.
         *
         * @param {Object.<string, *>} values   The values to cache, indexed by their cache identifier
         * @param {int} lifetime The lifetime of the cached values, 0 for persisting until manual cleaning
         *
         * @returns {Promise<Object.<string, *>|boolean>} The identifiers that failed to be cached or a boolean stating if caching succeeded or not
         *
         * @abstract
         *
         * @protected
         */
        protected abstract _doSave(values: Record<string, T>, lifetime: number): Promise<Record<string, T> | boolean>;

        /**
         * @inheritdoc
         */
        hasItem(key: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        clear(): Promise<boolean>;

        /**
         * @inheritdoc
         */
        deleteItem(key: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        deleteItems(keys: string[]): Promise<boolean>;

        /**
         * Enables/disables versioning of items.
         *
         * When versioning is enabled, clearing the cache is atomic and doesn't require listing existing keys to proceed,
         * but old keys may need garbage collection and extra round-trips to the back-end are required.
         *
         * Calling this method also clears the memoized namespace version and thus forces a resynchonization of it.
         *
         * @param [enable = true]
         *
         * @returns the previous state of versioning
         */
        enableVersioning(enable?: boolean): boolean;

        private _getId(key: string): Promise<any>;
    }
}
