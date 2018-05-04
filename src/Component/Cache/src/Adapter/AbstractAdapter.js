const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
const CacheItem = Jymfony.Component.Cache.CacheItem;
const CacheItemPoolInterface = Jymfony.Component.Cache.CacheItemPoolInterface;
const InvalidArgumentException = Jymfony.Component.Cache.Exception.InvalidArgumentException;
const AbstractTrait = Jymfony.Component.Cache.Traits.AbstractTrait;
const LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
const NullLogger = Jymfony.Component.Logger.NullLogger;

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
    }

    /**
     * Creates a system cache pool.
     *
     * @param {string} namespace
     * @param {int} defaultLifetime
     * @param {string} directory
     * @param {Jymfony.Component.Logger.LoggerInterface} [logger = new NullLogger()]
     */
    static createSystemCache(namespace, defaultLifetime, directory, logger = new NullLogger()) {
        const arr = new ArrayAdapter(defaultLifetime);
        arr.setLogger(logger);

        return arr;
    }
}

module.exports = AbstractAdapter;
