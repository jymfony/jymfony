import { chmodSync, existsSync, renameSync, statSync as stat, unlinkSync, writeFileSync } from 'fs';
import { createHash, randomBytes } from 'crypto';
import { dirname } from 'path';

const AdapterInterface = Jymfony.Component.Cache.Adapter.AdapterInterface;
const CacheInterface = Jymfony.Contracts.Cache.CacheInterface;
const CacheItem = Jymfony.Component.Cache.CacheItem;
const ContractsTrait = Jymfony.Component.Cache.Traits.ContractsTrait;
const InvalidArgumentException = Jymfony.Contracts.Cache.Exception.InvalidArgumentException;
const ProxyAdapter = Jymfony.Component.Cache.Adapter.ProxyAdapter;
const ProxyTrait = Jymfony.Component.Cache.Traits.ProxyTrait;

const valuesCache = {};

const is_file = file => {
    try {
        const stat = stat(file);

        return stat.isFile();
    } catch (e) {
        return false;
    }
};

const is_dir = file => {
    try {
        const stat = stat(file);

        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

/**
 * Caches items at warm up time using a js file.
 * Warmed up items are read-only and run-time discovered items are cached using a fallback adapter.
 *
 * @memberOf Jymfony.Component.Cache.Adapter
 */
export default class JsFileAdapter extends implementationOf(AdapterInterface, CacheInterface, ContractsTrait, ProxyTrait) {
    /**
     * Constructor.
     *
     * @param {string} file The file were values are cached
     * @param {Jymfony.Component.Cache.Adapter.AdapterInterface} fallbackPool A pool to fallback on when an item is not hit
     */
    __construct(file, fallbackPool) {
        /**
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._keys = undefined;

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._values = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._file = file;

        /**
         * @type {Jymfony.Component.Cache.Adapter.AdapterInterface}
         *
         * @private
         */
        this._pool = fallbackPool;

        this._createCacheItem = (key, value, isHit) => {
            const item = new CacheItem();
            item._key = key;
            item._value = value;
            item._isHit = isHit;

            return item;
        };
    }

    /**
     * @inheritdoc
     */
    close() {
        // Do nothing.
    }

    /**
     * @param {string} file The JS file were values are cached
     * @param {Jymfony.Contracts.Cache.CacheItemPoolInterface} fallbackPool A pool to fallback on when an item is not hit
     *
     * @returns {Jymfony.Contracts.Cache.CacheItemPoolInterface}
     */
    static create(file, fallbackPool) {
        if (! (fallbackPool instanceof AdapterInterface)) {
            fallbackPool = new ProxyAdapter(fallbackPool);
        }

        return new JsFileAdapter(file, fallbackPool);
    }

    /**
     * @inheritdoc
     */
    async get(key, callback, beta = null) {
        if (undefined === this._values) {
            this._initialize();
        }

        const get_from_pool = async () => {
            if (this._pool instanceof CacheInterface) {
                return this._pool.get(key, callback, beta);
            }

            return this._doGet(this._pool, key, callback, beta);
        };

        if (undefined === this._keys[key]) {
            return get_from_pool();
        }

        const value = this._values[this._keys[key]];

        if ('N' === value) {
            return null;
        }

        if ('U' === value) {
            return undefined;
        }

        try {
            if (isFunction(value)) {
                return value();
            }
        } catch (e) {
            delete this._keys[key];

            return get_from_pool();
        }

        return value;
    }

    /**
     * @inheritdoc
     */
    async getItem(key) {
        if (! isString(key)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Cache key must be string, "%s" given.', __jymfony.get_debug_type(key)));
        }

        if (undefined === this._values) {
            this._initialize();
        }

        if (undefined === this._keys[key]) {
            return this._pool.getItem(key);
        }

        let value = this._values[this._keys[key]];
        let isHit = true;

        if ('N' === value) {
            value = null;
        } else if ('U' === value) {
            value = undefined;
        } else if (isFunction(value)) {
            try {
                value = value();
            } catch (e) {
                value = null;
                isHit = false;
            }
        }

        const f = this._createCacheItem;

        return f(key, value, isHit);
    }

    /**
     * @inheritdoc
     */
    async getItems(keys = [])
    {
        for (const key of keys) {
            if (! isString(key)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Cache key must be string, "%s" given.', __jymfony.get_debug_type(key)));
            }
        }

        if (undefined === this._values) {
            this._initialize();
        }

        return this._generateItems(keys);
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    async hasItem(key) {
        if (! isString(key)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Cache key must be string, "%s" given.', __jymfony.get_debug_type(key)));
        }

        if (undefined === this._values) {
            this._initialize();
        }

        return this._keys[key] || await this._pool.hasItem(key);
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    async deleteItem(key) {
        if (! isString(key)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Cache key must be string, "%s" given.', __jymfony.get_debug_type(key)));
        }

        if (undefined === this._values) {
            this._initialize();
        }

        return ! this._keys[key] && await this._pool.deleteItem(key);
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    async deleteItems(keys) {
        let deleted = true;
        const fallbackKeys = [];

        for (const key of keys) {
            if (! isString(key)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Cache key must be string, "%s" given.', __jymfony.get_debug_type(key)));
            }

            if (undefined !== this._keys[key]) {
                deleted = false;
            } else {
                fallbackKeys.push(key);
            }
        }

        if (undefined === this._values) {
            this._initialize();
        }

        if (0 !== fallbackKeys.length) {
            deleted = await this._pool.deleteItems(fallbackKeys) && deleted;
        }

        return deleted;
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    async save(item) {
        if (undefined === this._values) {
            this._initialize();
        }

        return undefined !== this._keys[item.key] && await this._pool.save(item);
    }

    /**
     * @inheritdoc
     *
     * @returns {Promise<boolean>}
     */
    async clear(prefix = '') {
        this._keys = {};
        this._values = {};

        let cleared = false;
        try {
            cleared = unlinkSync(this._file) || ! existsSync(this._file);
        } catch (e) {
            // Do nothing.
        }

        delete valuesCache[this._file];

        if (this._pool instanceof AdapterInterface) {
            return await this._pool.clear(prefix) && cleared;
        }

        return await this._pool.clear() && cleared;
    }

    /**
     * Store an array of cached values.
     *
     * @param {Object.<string, *>} values The cached values
     */
    warmUp(values) {
        const VarExporter = Jymfony.Component.VarExporter.VarExporter;

        if (existsSync(this._file) && !is_file(this._file)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Cache path exists and is not a file: "%s".', this._file));
        }

        const directory = dirname(this._file);

        if (! is_dir(directory)) {
            try {
                __jymfony.mkdir(directory, 0o777);
            } catch (e) {
                // Do nothing.
            }
        }

let dumpedValues = '';
const dumpedMap = {};
let dump = `
// This file has been auto-generated by the Jymfony Cache Component.

return [{

`;

        for (let [key, value] of __jymfony.getEntries(values)) {
            CacheItem.validateKey(isNumber(key) ? String(key) : key);
            let isStaticValue = true;

            if (null === value || undefined === value) {
                value = __jymfony.serialize(value);
            } else if (isObject(value) || isArray(value)) {
                isStaticValue = false;

                try {
                    value = VarExporter.export(value);
                } catch (e) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Cache key "%s" has non-serializable "%s" value.', key, __jymfony.get_debug_type(value)), 0, e);
                }
            } else if (isString(value)) {
                // Wrap "N" in a closure to not confuse it with an encoded `null`
                if ('N' === value || "U" === value) {
                    isStaticValue = false;
                }

                value = JSON.stringify(value);
            } else if (! isScalar(value)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Cache key "%s" has non-serializable "%s" value.', key, __jymfony.get_debug_type(value)));
            } else {
                value = JSON.stringify(value);
            }

            if (! isStaticValue) {
                value = value.replace("\n", "\n    ");
                value = `() => {\n    return ${value};\n}`;
            }

            const hash = createHash('md5');
            hash.update(value);

            const hashStr = hash.digest();
            let id = dumpedMap[hashStr];

            if (undefined === id) {
                id = dumpedMap[hash] = Object.keys(dumpedMap).length;
                dumpedValues += `${id}: ${value},\n`;
            }

            dump += `[${JSON.stringify(key)}]: ${id},\n"`;
        }

        dump += `\n}, {\n\n${dumpedValues}\n}];\n`;

        const tmpFile = this._file + randomBytes(4).readUInt32LE(0);
        writeFileSync(tmpFile, dump);

        const umask = process.umask();
        const mode = 0o666 & ~umask;
        chmodSync(tmpFile, mode);

        renameSync(tmpFile, this._file);
        delete valuesCache[this._file];

        this._initialize();
    }

    /**
     * Load the cache file.
     *
     * @private
     */
    _initialize() {
        let values;
        if (undefined !== valuesCache[this._file]) {
            values = valuesCache[this._file];
        } else if (! is_file(this._file)) {
            this._keys = {};
            this._values = {};

            return;
        } else {
            values = valuesCache[this._file] = (require(this._file)) || [{}, {}];
        }

        if (2 !== values.length || undefined === values[0] || undefined === values[1]) {
            this._keys = {};
            this._values = {};
        } else {
            [ this._keys, this._values ] = values;
        }
    }

    /**
     * @private
     */
    async * _generateItems(keys) {
        const f = this._createCacheItem;
        const fallbackKeys = [];

        for (const key of keys) {
            if (this._keys[key]) {
                const value = this._values[this._keys[key]];

                if ('N' === value) {
                    yield [ key, f(key, null, true) ];
                } else if (isFunction(value)) {
                    try {
                        yield [ key, f(key, value(), true) ];
                    } catch (e) {
                        yield [ key, f(key, null, false) ];
                    }
                } else {
                    yield [ key, f(key, value, true) ];
                }
            } else {
                fallbackKeys.push(key);
            }
        }

        if (fallbackKeys.length) {
            yield * await this._pool.getItems(fallbackKeys);
        }
    }
}
