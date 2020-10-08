const ValueHolder = Jymfony.Contracts.Cache.ValueHolder;

/**
 * Covers most simple to advanced caching needs.
 *
 * @memberOf Jymfony.Contracts.Cache
 */
class CacheInterface {
    /**
     * Fetches a value from the pool or computes it if not found.
     *
     * On cache misses, a callback is called that should return the missing value.
     * This callback is given a CacheItemInterface instance corresponding to the
     * requested key, that could be used e.g. for expiration control. It could also
     * be an ItemInterface instance when its additional features are needed.
     *
     * @param {string} key The key of the item to retrieve from the cache
     * @param {Function|Invokable} callback Should return the computed value for the given key/item
     * @param {float|null} beta A float that, as it grows, controls the likeliness of triggering
     *                          early expiration. 0 disables it, INF forces immediate expiration.
     *                          The default (or providing null) is implementation dependent but should
     *                          typically be 1.0, which should provide optimal stampede protection.
     *                          See https://en.wikipedia.org/wiki/Cache_stampede#Probabilistic_early_expiration
     *
     * @return {Promise<*>} The value corresponding to the provided key
     *
     * @throws {Jymfony.Contracts.Cache.Exception.InvalidArgumentException} When $key is not valid or when $beta is negative
     */
    get(key, callback, beta = null) { }

    /**
     * Removes an item from the pool.
     *
     * @param {string} key The key to delete
     *
     * @throws {Jymfony.Contracts.Cache.Exception.InvalidArgumentException} When key is not valid
     *
     * @returns {Promise<boolean>} True if the item was successfully removed, false if there was any error
     */
    delete(key) { }
}

export default getInterface(CacheInterface);
