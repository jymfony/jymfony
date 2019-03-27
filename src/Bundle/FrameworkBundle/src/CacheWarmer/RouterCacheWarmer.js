const CacheWarmerInterface = Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface;

/**
 * Generates the router matcher and generator classes.
 *
 * @final
 *
 * @memberOf Jymfony.Bundle.FrameworkBundle.CacheWarmer
 */
class RouterCacheWarmer extends implementationOf(CacheWarmerInterface) {
    /**
     * Constructor
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} container
     */
    __construct(container) {
        /**
         * As this cache warmer is optional, dependencies should be lazy-loaded, that's why a container should be injected.
         *
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._container = container;
    }

    /**
     * Warms up the cache.
     *
     * @param {string} cacheDir The cache directory
     */
    async warmUp(cacheDir) {
        const router = this._container.get('router');
        await router.warmUp(cacheDir);
    }

    /**
     * Checks whether this warmer is optional or not.
     *
     * @returns {boolean} always true
     */
    get optional() {
        return true;
    }
}

module.exports = RouterCacheWarmer;
