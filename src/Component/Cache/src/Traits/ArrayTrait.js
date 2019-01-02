const CacheItem = Jymfony.Component.Cache.CacheItem;
const DateTime = Jymfony.Component.DateTime.DateTime;
const LoggerAwareTrait = Jymfony.Component.Logger.LoggerAwareTrait;

/**
 * @memberOf Jymfony.Component.Cache.Traits
 */
class ArrayTrait extends LoggerAwareTrait.definition {
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

        /**
         * @type {number}
         *
         * @private
         */
        this._pruneInterval = undefined;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async prune() {
        const time = DateTime.unixTime;
        for (const key of Object.keys(this._expiries)) {
            if (time < this._expiries[key]) {
                continue;
            }

            await this.deleteItem(key);
        }
    }

    /**
     * Returns all cached values, with cache miss as null.
     *
     * @returns {Object.<string, string>}
     */
    get values() {
        return Object.assign({}, this._values);
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

        if (undefined !== this._pruneInterval && 0 === Object.keys(this._expiries).length) {
            clearInterval(this._pruneInterval);
            this._pruneInterval = undefined;
        }

        return true;
    }
}

module.exports = getTrait(ArrayTrait);
