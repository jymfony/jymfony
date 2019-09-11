/**
 * @memberOf Jymfony.Component.Kernel.CacheClearer
 */
class CacheClearerInterface {
    /**
     * Clears any caches necessary
     *
     * @param {string} cacheDir
     */
    clear(cacheDir) { }
}

export default getInterface(CacheClearerInterface);
