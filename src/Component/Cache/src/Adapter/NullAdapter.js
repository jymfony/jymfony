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
}

module.exports = NullAdapter;
