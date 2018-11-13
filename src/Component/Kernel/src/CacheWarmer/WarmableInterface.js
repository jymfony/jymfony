/**
 * Interface for classes that support warming their cache.
 *
 * @memberOf Jymfony.Component.Kernel.CacheWarmer
 */
class WarmableInterface {
    /**
     * Warms up the cache.
     *
     * @param {string} cacheDir The cache directory
     */
    warmUp(cacheDir) { }
}

module.exports = getInterface(WarmableInterface);
