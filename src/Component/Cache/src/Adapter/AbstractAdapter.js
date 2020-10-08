import * as fs from 'fs';

const AbstractAdapterTrait = Jymfony.Component.Cache.Traits.AbstractAdapterTrait;
const AdapterInterface = Jymfony.Component.Cache.Adapter.AdapterInterface;
const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
const CacheItem = Jymfony.Component.Cache.CacheItem;
const CacheInterface = Jymfony.Contracts.Cache.CacheInterface;
const ContractsTrait = Jymfony.Component.Cache.Traits.ContractsTrait;
const FilesystemAdapter = Jymfony.Component.Cache.Adapter.FilesystemAdapter;
const LoggerAwareInterface = Jymfony.Contracts.Logger.LoggerAwareInterface;
const InvalidArgumentException = Jymfony.Contracts.Cache.Exception.InvalidArgumentException;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const RedisAdapter = Jymfony.Component.Cache.Adapter.RedisAdapter;

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 * @abstract
 */
export default class AbstractAdapter extends implementationOf(AdapterInterface, CacheInterface, LoggerAwareInterface, AbstractAdapterTrait, ContractsTrait) {
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
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
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
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger]
     */
    static createSystemCache(namespace, defaultLifetime, directory, logger = undefined) {
        const cache = (() => {
            try {
                const fsAdapter = new FilesystemAdapter(namespace, defaultLifetime, directory);
                fs.accessSync(directory, fs.constants.W_OK);

                return fsAdapter;
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
     * Creates a connection for cache adapter.
     *
     * @param {string} dsn
     * @param {Object.<string, *>} options
     */
    static createConnection(dsn, options = undefined) {
        options = options || {};

        if (! isString(dsn)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The createConnection() method expect argument #1 to be string, %s given.', typeof dsn));
        }
        if (0 === dsn.indexOf('redis:')) {
            return RedisAdapter.createConnection(dsn, options);
        }

        throw new InvalidArgumentException(__jymfony.sprintf('Unsupported DSN: %s.', dsn));
    }

    /**
     * @inheritdoc
     */
    async close() {
        // Nothing to do.
    }
}
