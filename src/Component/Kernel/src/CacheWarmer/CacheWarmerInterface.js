const WarmableInterface = Jymfony.Component.Kernel.CacheWarmer.WarmableInterface;

/**
 * Interface for classes able to warm up the cache.
 *
 * @memberOf Jymfony.Component.Kernel.CacheWarmer
 */
class CacheWarmerInterface extends WarmableInterface.definition {
    /**
     * Checks whether this warmer is optional or not.
     *
     * A warmer should return true is the cache can be generated
     * incrementally and on-demand.
     *
     * @returns {boolean}
     */
    get optional() { }
}

module.exports = getInterface(CacheWarmerInterface);
