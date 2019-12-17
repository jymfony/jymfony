import * as crypto from 'crypto';
import { promisify } from 'util';

const SessionStorageInterface = Jymfony.Component.HttpFoundation.Session.Storage.SessionStorageInterface;
const randomBytes = promisify(crypto.randomBytes);

/**
 * Cache storage backend for session.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session.Storage
 */
export default class CacheSessionStorage extends implementationOf(SessionStorageInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Cache.CacheItemPoolInterface} cache
     * @param {int} [lifetime = 0]
     */
    __construct(cache, lifetime = 0) {
        /**
         * @type {Jymfony.Component.Cache.CacheItemPoolInterface}
         *
         * @private
         */
        this._cache = cache;

        /**
         * @type {int}
         *
         * @private
         */
        this._lifetime = 0 < lifetime ? lifetime : undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._started = false;

        /**
         * Session bags.
         *
         * @type {Object.<string, Jymfony.Component.HttpFoundation.Session.SessionBagInterface>}
         *
         * @private
         */
        this._bags = {};

        /**
         * Session ID.
         *
         * @type {string|undefined}
         *
         * @private
         */
        this._id = undefined;

        /**
         * Session name.
         *
         * @type {string}
         *
         * @private
         */
        this._name = 'JFSESSID';
    }

    /**
     * @inheritdoc
     */
    async start() {
        if (! this._id) {
            this._id = await this._generateId();
        }

        if (this._started) {
            return;
        }

        await this._loadSession();
    }

    /**
     * @inheritdoc
     */
    get started() {
        return this._started;
    }

    /**
     * @inheritdoc
     */
    get id() {
        return this._id;
    }

    /**
     * @inheritdoc
     */
    set id(id) {
        if (this._started) {
            throw new LogicException('Cannot set session id after the session is started.');
        }

        this._id = id;
    }

    /**
     * @inheritdoc
     */
    get name() {
        return this._name;
    }

    /**
     * @inheritdoc
     */
    set name(name) {
        this._name = name;
    }

    /**
     * @inheritdoc
     */
    async regenerate(destroy = false, lifetime = 0) {
        if (! this._started) {
            await this.start();
        }

        if (destroy) {
            await this._destroy();
        }

        this._lifetime = lifetime;
    }

    /**
     * @inheritdoc
     */
    async save() {
        if (! this._started) {
            throw new RuntimeException('Trying to save a session that was not started yet or was already closed');
        }

        const item = await this._cache.getItem(this.id);
        item.set(this._bags);
        item.expiresAfter(this._lifetime);

        await this._cache.save(item);

        this._started = false;
    }

    /**
     * @inheritdoc
     */
    async clear() {
        for (const bag of Object.values(this._bags)) {
            bag.clear();
        }

        if (! this._started) {
            await this.start();
        }
    }

    /**
     * @inheritdoc
     */
    getBag(name) {
        return this._bags[name];
    }

    /**
     * @inheritdoc
     */
    registerBag(bag) {
        this._bags[bag.name] = bag;
    }

    /**
     * Loads the session attributes.
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _loadSession() {
        const item = await this._cache.getItem(this.id);
        const bags = item.isHit ? item.get() : {};

        for (const [ key, bag ] of __jymfony.getEntries(bags)) {
            this._bags[key] = bag;
        }

        this._started = true;
    }

    /**
     * Generates a new session ID.
     *
     * @returns {Promise<string>}
     *
     * @private
     */
    async _generateId() {
        return (await randomBytes(16)).toString('hex');
    }

    /**
     * Destroy the session data.
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _destroy() {
        if (! this._id) {
            return;
        }

        await this._cache.deleteItem(this._id);
    }
}
