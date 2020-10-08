const AdapterInterface = Jymfony.Component.Cache.Adapter.AdapterInterface;
const CacheItem = Jymfony.Component.Cache.CacheItem;
const CacheInterface = Jymfony.Contracts.Cache.CacheInterface;
const ValueHolder = Jymfony.Contracts.Cache.ValueHolder;

const createCacheItem = (key) => {
    const item = new CacheItem();
    item._key = key;
    item._isHit = false;

    return item;
};

export default class NullAdapter extends implementationOf(AdapterInterface, CacheInterface) {
    /**
     * @inheritdoc
     */
    get(key, callback, /* beta = undefined */) {
        const save = new ValueHolder(true);

        return callback(createCacheItem(key), save);
    }

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
