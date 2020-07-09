const CacheItem = Jymfony.Component.Cache.CacheItem;
const CacheItemPoolInterface = Jymfony.Component.Cache.CacheItemPoolInterface;
const ArrayTrait = Jymfony.Component.Cache.Traits.ArrayTrait;
const DateTime = Jymfony.Component.DateTime.DateTime;
const LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
const NullLogger = Jymfony.Component.Logger.NullLogger;

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 */
export default class ArrayAdapter extends implementationOf(CacheItemPoolInterface, LoggerAwareInterface, ArrayTrait) {
    __construct(defaultLifetime = 0) {
        /**
         * Create a cache item for the current adapter.
         *
         * @param key
         * @param value
         * @param isHit
         *
         * @returns {Jymfony.Component.Cache.CacheItem}
         *
         * @private
         */
        this._createCacheItem = (key, value, isHit) => {
            const item = new CacheItem();
            item._key = key;
            item._value = value;
            item._isHit = isHit;
            item._defaultLifetime = defaultLifetime;

            return item;
        };

        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = new NullLogger();
    }

    /**
     * @inheritdoc
     */
    async getItem(key) {
        let value;
        let isHit = await this.hasItem(key);

        try {
            if (! isHit) {
                this._values[key] = value = undefined;
            } else if ('B:0' === (value = this._values[key])) {
                value = false;
            } else if (false === (value = __jymfony.unserialize(value))) {
                this._values[key] = value = undefined;
                isHit = false;
            }
        } catch (e) {
            this._logger.warning('Failed to unserialize key "{key}"', {key: key, exception: e});
            this._values[key] = value = undefined;
            isHit = false;
        }

        return this._createCacheItem(key, value, isHit);
    }

    /**
     * @inheritdoc
     */
    async getItems(keys = []) {
        const map = new Map();

        for (const key of keys) {
            CacheItem.validateKey(key);
            map.set(key, await this.getItem(key));
        }

        return map;
    }

    /**
     * @inheritdoc
     */
    async deleteItems(keys) {
        for (const key of keys) {
            await this.deleteItem(key);
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    async save(item) {
        if (! (item instanceof CacheItem)) {
            return false;
        }

        const key = item._key;
        let value = item._value;
        let expiry = item._expiry;

        if (expiry && expiry <= DateTime.unixTime) {
            await this.deleteItem(key);

            return true;
        }

        try {
            value = __jymfony.serialize(value);
        } catch (e) {
            this._logger.warning('Failed to save key "{key}" ({type})', {key: key, type: __jymfony.get_debug_type(value), exception: e});

            return false;
        }

        if (undefined === expiry && 0 < item._defaultLifetime) {
            expiry = DateTime.unixTime + item._defaultLifetime;
        }

        this._values[key] = value;
        this._expiries[key] = undefined !== expiry ? expiry : Infinity;

        if (Infinity !== this._expiries[key] && undefined === this._pruneInterval) {
            this._pruneInterval = setInterval(this.prune.bind(this), 60000);
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    async close() {
        if (undefined !== this._pruneInterval) {
            clearInterval(this._pruneInterval);
        }
    }
}
