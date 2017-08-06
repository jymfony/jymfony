/**
 * @memberOf Jymfony.Component.Kernel.CacheWarmer
 */
class CacheWarmerInterface {
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
