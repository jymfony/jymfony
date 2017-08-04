/**
 * @memberOf Jymfony.Component.Kernel.CacheWarmer
 */
class CacheWarmerInterface {
    /**
     * Checks wheter this warmes is optional or not
     *
     * A warmer should return true is the cache can be generated
     * incrementally and on-demand
     *
     * @returns {boolean}
     */
    isOptional() { }
}

module.exports = getInterface(CacheWarmerInterface);
