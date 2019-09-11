/**
 * Interface for a ConfigCache factory. This factory creates
 * an instance of ConfigCacheInterface and initializes the
 * cache if necessary.
 *
 * @memberOf Jymfony.Component.Config
 */
class ConfigCacheFactoryInterface {
    /**
     * Creates a cache instance and (re-)initializes it if necessary.
     *
     * @param {string} file The absolute cache file path
     * @param {Function} callable The callable to be executed when the cache needs to be filled (i. e. is not fresh). The cache will be passed as the only parameter to this callback
     *
     * @returns {Jymfony.Component.Config.ConfigCacheInterface} The cache instance
     */
    cache(file, callable) { }
}

export default getInterface(ConfigCacheFactoryInterface);
