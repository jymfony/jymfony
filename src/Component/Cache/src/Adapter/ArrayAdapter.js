const CacheItem = Jymfony.Component.Cache.CacheItem;
const CacheItemPoolInterface = Jymfony.Component.Cache.CacheItemPoolInterface;
const ArrayTrait = Jymfony.Component.Cache.Traits.ArrayTrait;
const DateTime = Jymfony.Component.DateTime.DateTime;
const LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 * @abstract
 */
class ArrayAdapter extends implementationOf(CacheItemPoolInterface, LoggerAwareInterface, ArrayTrait) {
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
    }

    /**
     * @inheritDoc
     */
    getItem(key) {
        let value;
        let isHit = this.hasItem(key);

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
     * @inheritDoc
     */
    getItems(keys = []) {
        const that = this;

        return new Map((function * () {
            for (const key of keys) {
                CacheItem.validateKey(key);
                yield [ key, that.getItem(key) ];
            }
        })());
    }

    /**
     * @inheritDoc
     */
    deleteItems(keys) {
        for (const key of keys) {
            this.deleteItem(key);
        }

        return true;
    }

    /**
     * @inheritDoc
     */
    save(item) {
        if (! (item instanceof CacheItem)) {
            return false;
        }

        const key = item._key;
        let value = item._value;
        let expiry = item._expiry;

        if (expiry && expiry <= DateTime.unixTime) {
            this.deleteItem(key);

            return true;
        }

        try {
            value = __jymfony.serialize(value);
        } catch (e) {
            const type = isObject(value) ? ReflectionClass.getClassName(value) : typeof value;
            this._logger.warning('Failed to save key "{key}" ({type})', {key: key, type: type, exception: e});

            return false;
        }

        if (undefined === expiry && 0 < item._defaultLifetime) {
            expiry = DateTime.unixTime + item._defaultLifetime;
        }

        this._values[key] = value;
        this._expiries[key] = undefined !== expiry ? expiry : Infinity;

        return true;
    }
}

module.exports = ArrayAdapter;
