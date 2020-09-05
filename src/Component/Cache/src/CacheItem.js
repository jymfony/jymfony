const CacheItemInterface = Jymfony.Component.Cache.CacheItemInterface;
const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
const InvalidArgumentException = Jymfony.Component.Cache.Exception.InvalidArgumentException;
const TimeSpanInterface = Jymfony.Contracts.DateTime.TimeSpanInterface;

/**
 * @memberOf Jymfony.Component.Cache
 * @final
 */
export default class CacheItem extends implementationOf(CacheItemInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {string}
         *
         * @private
         */
        this._key = undefined;

        /**
         * @type {*}
         *
         * @private
         */
        this._value = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._isHit = false;

        /**
         * @type {int}
         *
         * @private
         */
        this._expiry = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._defaultLifetime = undefined;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._tags = [];

        /**
         * @type {*}
         *
         * @private
         */
        this._innerItem = undefined;

        /**
         * @type {*}
         *
         * @private
         */
        this._poolHash = undefined;
    }

    /**
     * @inheritdoc
     */
    get key() {
        return this._key;
    }

    /**
     * @inheritdoc
     */
    get() {
        return this._value;
    }

    /**
     * @inheritdoc
     */
    get isHit() {
        return this._isHit;
    }

    /**
     * @inheritdoc
     */
    set(value) {
        this._value = value;

        return this;
    }

    /**
     * @inheritdoc
     */
    expiresAt(expiration) {
        if (null === expiration || undefined === expiration) {
            this._expiry = 0 < this._defaultLifetime ? DateTime.unixTime : undefined;
        } else if (expiration instanceof DateTimeInterface) {
            this._expiry = expiration.timestamp;
        } else {
            throw new InvalidArgumentException(__jymfony.sprintf('Expiration date must an instance of DateTime or be null or undefined, "%s" given', __jymfony.get_debug_type(expiration)));
        }

        return this;
    }

    /**
     * @inheritdoc
     */
    expiresAfter(time) {
        if (null === time || undefined === time) {
            this._expiry = 0 < this._defaultLifetime ? DateTime.unixTime : undefined;
        } else if (time instanceof TimeSpanInterface) {
            this._expiry = DateTime.now.modify(time).timestamp;
        } else if (isNumber(time)) {
            this._expiry = new DateTime(DateTime.unixTime + time).timestamp;
        } else {
            throw new InvalidArgumentException(__jymfony.sprintf('Expiration date must an instance of TimeSpan, a Number or be null or undefined, "%s" given', __jymfony.get_debug_type(time)));
        }

        return this;
    }

    /**
     * Adds a tag to a cache item.
     *
     * @param {string|string[]} tags A tag or array of tags
     *
     * @returns {Jymfony.Component.Cache.CacheItem}
     *
     * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException} When tag is not valid
     */
    tag(tags) {
        if (! isArray(tags)) {
            tags = [ tags ];
        }

        for (const tag of tags) {
            if (! isString(tag)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Cache tag must be a string, "%s" given.', __jymfony.get_debug_type(tag)));
            }

            if (-1 !== this._tags.indexOf(tag)) {
                continue;
            }

            if (0 === tag.length) {
                throw new InvalidArgumentException('Cache tag must have length greater than 0');
            }

            if (/[{}()\/\\@:]/.test(tag)) {
                throw new InvalidArgumentException(`Cache tag "${tag}" contains invalid characters {}()/\\@:`);
            }

            this._tags.push(tag);
        }

        return this;
    }

    /**
     * @param {string} key
     *
     * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException} When key is not a valid string key.
     */
    static validateKey(key) {
        if (! isString(key)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Cache key must be a string, "%s" given.', __jymfony.get_debug_type(key)));
        }

        if (0 === key.length) {
            throw new InvalidArgumentException('Cache key must have length greater than 0');
        }

        if (/[{}()\/\\@:]/.test(key)) {
            throw new InvalidArgumentException(`Cache key "${key}" contains invalid characters {}()/\\@:`);
        }
    }
}
