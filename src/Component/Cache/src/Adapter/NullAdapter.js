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
    async getItem(key) {
        return createCacheItem(key);
    }

    /**
     * @inheritDoc
     */
    async getItems(keys = []) {
        return new Map((function * () {
            for (const key of keys) {
                yield [ key, createCacheItem(key) ];
            }
        })());
    }

    /**
     * @inheritDoc
     */
    async hasItem(/* key */) {
        return false;
    }

    /**
     * @inheritDoc
     */
    async clear() {
        return true;
    }

    /**
     * @inheritDoc
     */
    async deleteItem(/* key */) {
        return true;
    }

    /**
     * @inheritDoc
     */
    async deleteItems(/* keys */) {
        return true;
    }

    /**
     * @inheritDoc
     */
    async save(/* item */) {
        return false;
    }
}

module.exports = NullAdapter;
