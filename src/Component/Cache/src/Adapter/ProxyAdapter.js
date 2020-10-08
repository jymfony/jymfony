const AdapterInterface = Jymfony.Component.Cache.Adapter.AdapterInterface;
const CacheInterface = Jymfony.Contracts.Cache.CacheInterface;
const CacheItem = Jymfony.Component.Cache.CacheItem;
const ContractsTrait = Jymfony.Component.Cache.Traits.ContractsTrait;
const DateTime = Jymfony.Component.DateTime.DateTime;
const ProxyTrait = Jymfony.Component.Cache.Traits.ProxyTrait;
const PruneableInterface = Jymfony.Component.Cache.PruneableInterface;

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 */
export default class ProxyAdapter extends implementationOf(AdapterInterface, CacheInterface, PruneableInterface, ProxyTrait, ContractsTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Cache.CacheInterface} pool
     * @param {string} [namespace = '']
     * @param {int} [defaultLifetime = 0]
     */
    __construct(pool, namespace = '', defaultLifetime = 0) {
        /**
         * @type {Jymfony.Contracts.Cache.CacheInterface}
         *
         * @private
         */
        this._pool = pool;

        /**
         * @type {string}
         *
         * @private
         */
        this._namespace = '' === namespace ? '' : (CacheItem.validateKey(namespace), namespace);

        /**
         * @type {int}
         *
         * @private
         */
        this._namespaceLen = namespace.length;

        /**
         * @type {int}
         *
         * @private
         */
        this._defaultLifetime = defaultLifetime;

        /**
         * @param {string} key
         * @param {Jymfony.Component.Cache.CacheItem} innerItem
         *
         * @returns {Jymfony.Component.Cache.CacheItem}
         *
         * @private
         */
        this._createCacheItem = (key, innerItem) => {
            const item = new CacheItem();
            item._key = key;

            if (null === innerItem) {
                return item;
            }

            item._value = innerItem.get();
            item._isHit = innerItem.isHit;
            item._innerItem = innerItem;
            item._pool = new WeakRef(this);

            innerItem.set(null);

            return item;
        };

        /**
         * @param {Jymfony.Component.Cache.CacheItem} innerItem
         * @param {Jymfony.Component.Cache.CacheItem} item
         */
        this._setInnerItem = (innerItem, item) => {
            innerItem.set(item._value);
            innerItem.expiresAt(!! item._expiry ? DateTime.createFromFormat('U.v', __jymfony.sprintf('%.3f', item._expiry)) : null);
        };
    }

    /**
     * @inheritdoc
     */
    get(key, callback, beta = undefined) {
        if (! (this._pool instanceof CacheInterface)) {
            return this._doGet(this, key, callback, beta);
        }

        return this._pool.get(this._getId(key), async (innerItem, save) => {
            const item = this._createCacheItem(key, innerItem);

            let value = await callback(item, save);
            item.set(value);

            this._setInnerItem(innerItem, item);

            return value;
        }, beta);
    }

    /**
     * @inheritdoc
     */
    async getItem(key) {
        const item = await this._pool.getItem(this._getId(key));

        return this._createCacheItem(key, item);
    }

    /**
     * @inheritdoc
     */
    async getItems(keys = []) {
        if (this._namespaceLen) {
            for (const [ i, key ] of __jymfony.getEntries(keys)) {
                keys[i] = this._getId(key);
            }
        }

        const map = new Map();
        for (const [ key, item ] of this._generateItems(await this._pool.getItems(keys))) {
            map.set(key, item);
        }

        return map;
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    hasItem(key) {
        return this._pool.hasItem(this._getId(key));
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    clear(prefix = '') {
        if (this._pool instanceof AdapterInterface) {
            return this._pool.clear(this._namespace + prefix);
        }

        return this._pool.clear();
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    deleteItem(key) {
        return this._pool.deleteItem(this._getId(key));
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    deleteItems(keys) {
        if (this._namespaceLen) {
            for (const [ i, key ] of __jymfony.getEntries(keys)) {
                keys[i] = this._getId(key);
            }
        }

        return this._pool.deleteItems(keys);
    }

    /**
     * @inheritdoc
     */
    close() {
        // Nothing to do
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    save(item) {
        return this._doSave(item);
    }

    async _doSave(item) {
        if (! item instanceof CacheItem) {
            return false;
        }

        if (undefined === item._expiry && 0 < this._defaultLifetime) {
            item._expiry = this._defaultLifetime + DateTime.unixTime;
        }

        let innerItem;
        let innerPool = item._pool.deref();

        if (innerPool === this && item._innerItem) {
            innerItem = item._innerItem;
        } else if (! innerPool) {
            return false;
        } else if (innerPool instanceof AdapterInterface) {
            // this is an optimization specific for AdapterInterface implementations
            // so we can save a round-trip to the backend by just creating a new item
            const f = this._createCacheItem;
            innerItem = f(this._namespace + item._key, null);
        } else {
            innerItem = await innerPool.getItem(this._namespace + item._key);
        }

        this._setInnerItem(innerItem, item);

        return this._pool.save(innerItem);
    }

    * _generateItems(items) {
        const f = this._createCacheItem;

        for (let [ key, item ] of __jymfony.getEntries(items)) {
            if (this._namespaceLen) {
                key = key.substr(this._namespaceLen);
            }

            yield [ key, f(key, item) ];
        }
    }

    _getId(key) {
        CacheItem.validateKey(key);

        return this._namespace + key;
    }
}
