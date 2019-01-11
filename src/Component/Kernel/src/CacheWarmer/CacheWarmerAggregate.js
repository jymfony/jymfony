const CacheWarmerInterface = Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface;

/**
 * Aggregates several cache warmers into a single one.
 *
 * @memberOf Jymfony.Component.Kernel.CacheWarmer
 */
class CacheWarmerAggregate extends implementationOf(CacheWarmerInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface[]} warmers
     */
    __construct(warmers = []) {
        /**
         * @type {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface[]}
         *
         * @private
         */
        this._warmers = warmers;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._optionalsEnabled = false;
    }

    /**
     * Enables optional cache warmers.
     */
    enableOptionalWarmers() {
        this._optionalsEnabled = true;
    }

    /**
     * @inheritdoc
     */
    async warmUp(cacheDir) {
        for (const warmer of this._warmers) {
            if (! this._optionalsEnabled && warmer.optional) {
                continue;
            }

            await warmer.warmUp(cacheDir);
        }
    }

    /**
     * @inheritdoc
     */
    get optional() {
        return false;
    }

    /**
     * @param {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface[]} warmers
     */
    set warmers(warmers) {
        this._warmers = warmers;
    }

    /**
     * Adds a cache warmer.
     *
     * @param {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface} warmer
     */
    add(warmer) {
        this._warmers.push(warmer);
    }
}

module.exports = CacheWarmerAggregate;
