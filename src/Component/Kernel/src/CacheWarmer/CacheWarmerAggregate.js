/**
 * @memberOf Jymfony.Component.Kernel.CacheWarmer
 */
class CacheWarmerAggregate {
    /**
     * @param {[Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface]} warmers
     */
    __construct(warmers = []) {
        /**
         * @type {[Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface]}
         * @private
         */
        this._warmers = warmers;
    }

    enableOptionalWarmers() {
        /**
         * @type {boolean}
         * @private
         */
        this._optionalsEnabled = true;
    }

    /**
     * @param {String} cacheDir
     */
    warmUp(cacheDir) {
        for (let warmer of this._warmers) {
            if (! this._optionalsEnabled && warmer.isOptional()) {
                continue;
            }

            warmer.warmUp(cacheDir);
        }
    }

    isOptional() {
        return false;
    }

    set warmers (warmers) {
        this._warmers = warmers;
    }

    /**
     * @param {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface} warmer
     */
    add(warmer) {
        this._warmers.push(warmer);
    }
}

module.exports = CacheWarmerAggregate;
