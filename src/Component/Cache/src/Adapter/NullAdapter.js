const CacheItem = Jymfony.Component.Cache.CacheItem;
const CacheItemPoolInterface = Jymfony.Component.Cache.CacheItemPoolInterface;

const createCacheItem = (key) => {
    const item = new CacheItem();
    item._key = key;
    item._isHit = false;

    return item;
};

class NullAdapter extends implementationOf(CacheItemPoolInterface) {
    /**
     * @inheritDoc
     */
    getItem(key) {
        return createCacheItem(key);
    }

    /**
     * @inheritDoc
     */
    getItems(keys = []) {
        return new Map((function * (keys) {
            for (const key of keys) {
                yield [ key, createCacheItem(key) ];
            }
        })());
    }

    /**
     * @inheritDoc
     */
    hasItem(key) {
        return false;
    }

    /**
     * @inheritDoc
     */
    clear() {
        return true;
    }

    /**
     * @inheritDoc
     */
    deleteItem(key) {
        return true;
    }

    /**
     * @inheritDoc
     */
    deleteItems(keys) {
        return true;
    }

    /**
     * @inheritDoc
     */
    save(item) {
        return false;
    }

    /**
     * Sets a cache item to be persisted later.
     *
     * @param {Jymfony.Component.Cache.CacheItemInterface} item The cache item to save.
     *
     * @returns {boolean} False if the item could not be queued or if a commit was attempted and failed. True otherwise.
     */
    saveDeferred(item) {
        return false;
    }

    /**
     * Persists any deferred cache items.
     *
     * @returns {boolean} True if all not-yet-saved items were successfully saved or there were none. False otherwise.
     */
    commit() {
        return false;
    }
}

module.exports = NullAdapter;
