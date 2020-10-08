const CacheTrait = Jymfony.Contracts.Cache.CacheTrait;
const InvalidArgumentException = Jymfony.Contracts.Cache.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Cache.Traits
 */
class ContractsTrait extends CacheTrait.definition {
    __construct() {
        /**
         * @type {Set<string>}
         *
         * @private
         */
        this._computing = new Set();
    }

    /**
     * @inheritdoc
     */
    async _doGet(pool, key, callback, beta = 1.0, logger = undefined) {
        if (0 > beta) {
            throw new InvalidArgumentException(__jymfony.sprintf('Argument "beta" provided to "%s.get()" must be a positive number, %f given.', __jymfony.get_debug_type(this), beta));
        }

        return super._doGet(pool, key, async (item, save) => {
            if (this._computing.has(key)) {
                const value = await callback(item, save);
                save.value = false;

                return value;
            }

            this._computing.add(key);

            try {
                const value = await callback(item, save);
                await pool.save(item.set(value));
                save.value = false;

                return value;
            } finally {
                this._computing.delete(key);
            }
        }, beta, logger || undefined);
    }
}

export default getTrait(ContractsTrait);
