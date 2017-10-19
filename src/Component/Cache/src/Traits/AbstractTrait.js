const CacheItem = Jymfony.Component.Cache.CacheItem;
const LoggerAwareTrait = Jymfony.Component.Logger.LoggerAwareTrait;

const crypto = require('crypto');

/**
 * @memberOf Jymfony.Component.Cache.Traits
 */
class AbstractTrait extends mix(undefined, LoggerAwareTrait) {
    __construct() {
        /**
         * @type {string|undefined}
         * @private
         */
        this._namespace = undefined;

        /**
         * @type {undefined|string}
         * @private
         */
        this._namespaceVersion = undefined;
    }

    /**
     * Fetches several cache items.
     *
     * @param {[string]} ids The cache identifiers to fetch
     *
     * @returns {[*]} The corresponding values found in the cache
     *
     * @abstract
     * @protected
     */
    * _doFetch(ids) { }

    /**
     * Confirms if the cache contains specified cache item.
     *
     * @param {string} id The identifier for which to check existence
     *
     * @returns {boolean} True if item exists in the cache, false otherwise
     *
     * @abstract
     * @protected
     */
    * _doHave(id) { }

    /**
     * Deletes all items in the pool.
     *
     * @param {string} namespace The prefix used for all identifiers managed by this pool
     *
     * @returns {boolean} True if the pool was successfully cleared, false otherwise
     *
     * @abstract
     * @protected
     */
    * _doClear(namespace) { }

    /**
     * Removes multiple items from the pool.
     *
     * @param {[string]} ids An array of identifiers that should be removed from the pool
     *
     * @returns {boolean} True if the items were successfully removed, false otherwise
     *
     * @abstract
     * @protected
     */
    * _doDelete(ids) { }

    /**
     * Persists several cache items immediately.
     *
     * @param {Object<string, *>} values   The values to cache, indexed by their cache identifier
     * @param {int} lifetime The lifetime of the cached values, 0 for persisting until manual cleaning
     *
     * @return {Object<string, *>|boolean} The identifiers that failed to be cached or a boolean stating if caching succeeded or not
     *
     * @abstract
     * @protected
     */
    * _doSave(values, lifetime) { }

    /**
     * @inheritDoc
     */
    * hasItem(key) {
        const id = yield this._getId(key);

        try {
            return yield this._doHave(id);
        } catch (e) {
            this._logger.warning('Failed to check if key "{key}" is cached', {key: key, exception: e});

            return false;
        }
    }

    /**
     * @inheritDoc
     */
    * clear() {
        let cleared = undefined !== this._namespaceVersion;
        if (cleared) {
            this._namespaceVersion = 2;

            for (const v of yield this._doFetch([ '@' + this._namespace ])) {
                this._namespaceVersion = 1 + ~~v;
            }

            this._namespaceVersion += ':';
            cleared = yield this._doSave({['@' + this._namespace]: this._namespaceVersion}, 0);
        }

        try {
            return yield * this._doClear(this._namespace) || cleared;
        } catch (e) {
            this._logger.warning('Failed to clear the cache', {exception: e});

            return false;
        }
    }

    /**
     * @inheritDoc
     */
    * deleteItem(key) {
        return yield * this._deleteItems([ key ]);
    }

    /**
     * @inheritDoc
     */
    * deleteItems(keys) {
        const ids = [];
        for (const key of keys) {
            ids.push(yield this._getId(key));
        }

        try {
            if (yield this._doDelete(ids)) {
                return true;
            }
        } catch (e) {
        }

        let ok = true, e;

        // When bulk-delete failed, retry each item individually
        for (const [ key, id ] of __jymfony.getEntries(ids)) {
            try {
                e = undefined;
                if (yield this._doDelete([ id ])) {
                    continue;
                }
            } catch (e) {
            }

            this._logger.warning('Failed to delete key "{key}"', { key: key, exception: e });
            ok = false;
        }

        return ok;
    }

    /**
     * Enables/disables versioning of items.
     *
     * When versioning is enabled, clearing the cache is atomic and doesn't require listing existing keys to proceed,
     * but old keys may need garbage collection and extra round-trips to the back-end are required.
     *
     * Calling this method also clears the memoized namespace version and thus forces a resynchonization of it.
     *
     * @param {boolean} enable
     *
     * @returns {boolean} the previous state of versioning
     */
    enableVersioning(enable = true) {
        const wasEnabled = undefined !== this._namespaceVersion;
        this._namespaceVersion = '';

        return wasEnabled;
    }

    * _getId(key) {
        CacheItem.validateKey(key);

        if ('' === this._namespaceVersion) {
            this._namespaceVersion = '1:';
            for (const v of yield this._doFetch([ '@' + this._namespace ])) {
                this._namespaceVersion = v;
            }
        }

        if (undefined === this.constructor.MAX_ID_LENGTH) {
            return this._namespace + this._namespaceVersion + key;
        }

        let id = this._namespace + this._namespaceVersion + key;
        if (id.length > this.constructor.MAX_ID_LENGTH) {
            const hash = crypto.createHash('sha256');
            hash.update(key);
            key = hash.digest('base64');
            id = this._namespace + this._namespaceVersion + key;
        }

        return id;
    }

}

AbstractTrait.MAX_ID_LENGTH = undefined;

module.exports = getTrait(AbstractTrait);
