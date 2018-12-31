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
     * @inheritdoc
     */
    async getItem(key) {
        return createCacheItem(key);
    }

    /**
     * @inheritdoc
     */
    async getItems(keys = []) {
        return new Map((function * () {
            for (const key of keys) {
                yield [ key, createCacheItem(key) ];
            }
        })());
    }

    /**
     * @inheritdoc
     */
    async hasItem(/* key */) {
        return false;
    }

    /**
     * @inheritdoc
     */
    async clear() {
        return true;
    }

    /**
     * @inheritdoc
     */
    async deleteItem(/* key */) {
        return true;
    }

    /**
     * @inheritdoc
     */
    async deleteItems(/* keys */) {
        return true;
    }

    /**
     * @inheritdoc
     */
    async save(/* item */) {
        return false;
    }

    /**
     * @inheritdoc
     */
    async close() {
        // Nothing to do.
    }
}

module.exports = NullAdapter;
