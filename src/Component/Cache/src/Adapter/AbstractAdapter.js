const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
const FilesystemAdapter = Jymfony.Component.Cache.Adapter.FilesystemAdapter;
const CacheItem = Jymfony.Component.Cache.CacheItem;
const CacheItemPoolInterface = Jymfony.Component.Cache.CacheItemPoolInterface;
const InvalidArgumentException = Jymfony.Component.Cache.Exception.InvalidArgumentException;
const AbstractTrait = Jymfony.Component.Cache.Traits.AbstractTrait;
const DateTime = Jymfony.Component.DateTime.DateTime;
const LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
const NullLogger = Jymfony.Component.Logger.NullLogger;

const fs = require('fs');

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 * @abstract
 */
class AbstractAdapter extends implementationOf(CacheItemPoolInterface, LoggerAwareInterface, AbstractTrait) {
    /**
     * Constructor.
     *
     * @param {string} [namespace = '']
     * @param {int} [defaultLifetime = 0]
     */
    __construct(namespace = '', defaultLifetime = 0) {
        /**
         * @type {string}
         *
         * @private
         */
        this._namespace = '' === namespace ? '' : (CacheItem.validateKey(namespace) + ':');
        if (undefined !== this.constructor.MAX_ID_LENGTH && namespace.length > this.constructor.MAX_ID_LENGTH - 24) {
            throw new InvalidArgumentException(__jymfony.sprintf('Namespace must be %d chars max, %d given ("%s")', this.constructor.MAX_ID_LENGTH - 24, namespace.length, namespace));
        }

        /**
         * Create a cache item for the current adapter.
         *
         * @param {string} key
         * @param {*} value
         * @param {boolean} isHit
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
     * Creates a system cache pool.
     *
     * @param {string} namespace
     * @param {int} defaultLifetime
     * @param {string} directory
     * @param {Jymfony.Component.Logger.LoggerInterface} [logger]
     */
    static createSystemCache(namespace, defaultLifetime, directory, logger = undefined) {
        const cache = (() => {
            try {
                const fsAdapter = new FilesystemAdapter(namespace, defaultLifetime, directory);
                if (fs.accessSync(directory, fs.constants.W_OK)) {
                    return fsAdapter;
                }
            } catch (e) {
                if ('EROFS' !== e.code) {
                    throw e;
                }
            }

            return new ArrayAdapter(defaultLifetime);
        })();

        cache.setLogger(logger || new NullLogger());

        return cache;
    }

    /**
     * @inheritdoc
     */
    async getItem(key) {
        const id = await this._getId(key);

        let isHit = false;
        let value = undefined;

        try {
            for (const val of Object.values(await this._doFetch([ id ]))) {
                value = val;
                isHit = true;
            }
        } catch (e) {
            this._logger.warning('Failed to fetch key "{key}"', { key, exception: e });
        }

        return this._createCacheItem(key, value, isHit);
    }

    /**
     * @inheritdoc
     */
    async getItems(keys = []) {
        let ids = await Promise.all(keys.map(key => this._getId(key)));

        let items;
        try {
            items = await this._doFetch(ids);
        } catch (e) {
            this._logger.warning('Failed to fetch requested items', { keys, exception: e });

            items = [];
        }

        ids = Object.entries(ids)
            .reduce((res, val) => (res[val[1]] = keys[val[0]], res), {});

        return new Map(this._generateItems(items, ids));
    }

    /**
     * @inheritdoc
     */
    save(item) {
        if (! (item instanceof CacheItem)) {
            return false;
        }

        let lifetime = item._expiry - DateTime.unixTime;
        if (undefined === item._expiry) {
            lifetime = item._defaultLifetime;
        }

        if (undefined !== lifetime && 0 > lifetime) {
            return this._doDelete([ item.key ]);
        }

        return this._doSave({ [item.key]: item.get() }, lifetime);
    }

    * _generateItems(items, keys) {
        try {
            for (const [ id, value ] of __jymfony.getEntries(items)) {
                if (undefined === keys[id]) {
                    continue;
                }

                const key = keys[id];
                delete keys[id];
                yield [ key, this._createCacheItem(key, value, true) ];
            }
        } catch (e) {
            this._logger.warning('Failed to fetch requested items', { keys: Object.values(keys), exception: e });
        }

        for (const key of Object.values(keys)) {
            yield [ key, this._createCacheItem(key, undefined, false) ];
        }
    }

    /**
     * @inheritdoc
     */
    async close() {
        // Nothing to do.
    }
}

module.exports = AbstractAdapter;
