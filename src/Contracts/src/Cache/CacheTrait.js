const ValueHolder = Jymfony.Contracts.Cache.ValueHolder;

/**
 * An implementation of CacheInterface for CacheItemPoolInterface classes.
 *
 * @memberOf Jymfony.Contracts.Cache
 */
class CacheTrait {
    /**
     * @inheritdoc
     */
    get(key, callback, beta = undefined) {
        return this._doGet(this, key, callback, beta);
    }

    /**
     * @inheritdoc
     */
    delete(key) {
        return this.deleteItem(key);
    }

    /**
     * @param {Jymfony.Contracts.Cache.CacheItemPoolInterface} pool
     * @param {string} key
     * @param {function} callback
     * @param {float} [beta = 1.0]
     *
     * @private
     */
    async _doGet(pool, key, callback, beta = 1.0, /* logger = undefined */) {
        if (0 > beta) {
            const exceptionClass = class extends Jymfony.Contracts.Cache.Exception.InvalidArgumentException {};
            throw new exceptionClass(__jymfony.sprintf('Argument "beta" provided to "%s.get()" must be a positive number, %f given.', ReflectionClass.getClassName(this), beta));
        }

        const item = await pool.getItem(key);
        const recompute = ! item.isHit || Infinity === beta;

        if (recompute) {
            const save = new ValueHolder(true);
            item.set(await callback(item, save));
            if (save.value) {
                await pool.save(item);
            }
        }

        return item.get();
    }
}

export default getTrait(CacheTrait);
