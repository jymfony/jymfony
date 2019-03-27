declare namespace Jymfony.Component.Cache {
    /**
     * CacheItemPoolInterface generates CacheItemInterface objects.
     *
     * The primary purpose of CacheItemPoolInterface is to accept a key from
     * the Calling Library and return the associated CacheItemInterface object.
     * It is also the primary point of interaction with the entire cache collection.
     * All configuration and initialization of the Pool is left up to an
     * Implementing Library.
     */
    export class CacheItemPoolInterface<T> implements MixinInterface {
        public static readonly definition: Newable<CacheItemPoolInterface<any>>;

        /**
         * Returns a Cache Item representing the specified key.
         *
         * This method must always return a CacheItemInterface object, even in case of
         * a cache miss. It MUST NOT return null.
         *
         * @param key The key for which to return the corresponding Cache Item.
         *
         * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException}
         *   If the key string is not a legal value a InvalidArgumentException
         *   MUST be thrown.
         *
         * @returns The corresponding Cache Item.
         */
        getItem(key: string): Promise<CacheItemInterface<T>>;

        /**
         * Returns a traversable set of cache items.
         *
         * @param [keys = []] An indexed array of keys of items to retrieve.
         *
         * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException}
         *   If any of the keys in keys are not a legal value a InvalidArgumentException
         *   MUST be thrown.
         *
         * @returns A collection (Map) of Cache Items keyed by the cache keys of
         *   each item. A Cache item will be returned for each key, even if that
         *   key is not found. However, if no keys are specified then an empty
         *   traversable MUST be returned instead.
         */
        getItems(keys?: string[]): Promise<Map<string, CacheItemInterface<T>>>;

        /**
         * Confirms if the cache contains specified cache item.
         *
         * Note: This method MAY avoid retrieving the cached value for performance reasons.
         * This could result in a race condition with CacheItemInterface.get(). To avoid
         * such situation use CacheItemInterface.isHit() instead.
         *
         * @param key The key for which to check existence.
         *
         * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException}
         *   If the key string is not a legal value a InvalidArgumentException
         *   MUST be thrown.
         *
         * @returns True if item exists in the cache, false otherwise.
         */
        hasItem(key: string): Promise<boolean>;

        /**
         * Deletes all items in the pool.
         *
         * @returns True if the pool was successfully cleared. False if there was an error.
         */
        clear(): Promise<boolean>;

        /**
         * Removes the item from the pool.
         *
         * @param key The key to delete.
         *
         * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException}
         *   If the key string is not a legal value a InvalidArgumentException
         *   MUST be thrown.
         *
         * @returns True if the item was successfully removed. False if there was an error.
         */
        deleteItem(key: string): Promise<boolean>;

        /**
         * Removes multiple items from the pool.
         *
         * @param keys An array of keys that should be removed from the pool.
         *
         * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException}
         *   If any of the keys in keys are not a legal value a InvalidArgumentException
         *   MUST be thrown.
         *
         * @returns True if the items were successfully removed. False if there was an error.
         */
        deleteItems(keys: string[]): Promise<boolean>;

        /**
         * Persists a cache item.
         *
         * @param item The cache item to save.
         *
         * @returns True if the item was successfully persisted. False if there was an error.
         */
        save(item: CacheItemInterface<T>): Promise<boolean>;

        /**
         * Closes the pool (disconnects from server, cleans up, etc).
         */
        close(): Promise<void>;
    }
}
