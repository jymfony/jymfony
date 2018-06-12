const CacheItem = Jymfony.Component.Cache.CacheItem;
const DateTime = Jymfony.Component.DateTime.DateTime;
const LoggerAwareTrait = Jymfony.Component.Logger.LoggerAwareTrait;

/**
 * @memberOf Jymfony.Component.Cache.Traits
 */
class ArrayTrait extends mix(undefined, LoggerAwareTrait) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._values = {};

        /**
         * @type {Object.<string, number>}
         *
         * @private
         */
        this._expiries = {};
    }

    /**
     * Returns all cached values, with cache miss as null.
     *
     * @returns {Object.<string, string>}
     */
    get values() {
        return this._values;
    }

    /**
     * @inheritdoc
     */
    async hasItem(key) {
        CacheItem.validateKey(key);

        return undefined !== this._expiries[key] && this._expiries[key] >= DateTime.unixTime || ! this.deleteItem(key);
    }

    /**
     * @inheritdoc
     */
    async clear() {
        this._values = {};
        this._expiries = {};

        return true;
    }

    /**
     * @inheritdoc
     */
    async deleteItem(key) {
        CacheItem.validateKey(key);

        delete this._values[key];
        delete this._expiries[key];

        return true;
    }
}

module.exports = getTrait(ArrayTrait);
