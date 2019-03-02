global.__jymfony = global.__jymfony || {};

/**
 * Provide exclusive locking.
 */
class Mutex {
    /**
     * Constructor.
     */
    constructor() {
        /**
         * @type {Function[]}
         *
         * @private
         */
        this._queue = [];

        /**
         * @type {boolean}
         *
         * @private
         */
        this._pending = false;
    }

    /**
     * Whether the mutex is locked.
     *
     * @returns {boolean}
     */
    get locked() {
        return this._pending;
    }

    /**
     * Acquires the lock.
     * Use `await` to wait for lock to be available.
     *
     * @returns {Promise<Mutex>}
     */
    acquire() {
        const ticket = new Promise(resolve => this._queue.push(resolve));
        if (! this._pending) {
            this._dispatchNext();
        }

        return ticket;
    }

    /**
     * Runs task exclusively.
     *
     * @param {Function} callback
     *
     * @returns {Promise<*>}
     */
    async runExclusive(callback) {
        await this.acquire();

        try {
            return await callback();
        } finally {
            this.release();
        }
    }

    /**
     * Releases the mutex.
     */
    release() {
        this._dispatchNext();
    }

    /**
     * Unfreeze the next task in queue.
     *
     * @private
     */
    _dispatchNext() {
        if (0 < this._queue.length) {
            this._pending = true;
            this._queue.shift()(this);
        } else {
            this._pending = false;
        }
    }
}

__jymfony.Mutex = Mutex;
