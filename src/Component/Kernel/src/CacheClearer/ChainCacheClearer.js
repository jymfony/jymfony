const CacheClearerInterface = Jymfony.Component.Kernel.CacheClearer.CacheClearerInterface;

/**
 * @memberOf Jymfony.Component.Kernel.CacheClearer
 */
class ChainCacheClearer extends implementationOf(CacheClearerInterface) {
    /**
     * @param {Jymfony.Component.Kernel.CacheClearer.CacheClearerInterface[]} [clearers = []]
     */
    __construct(clearers = []) {
        this._clearers = clearers;
    }

    /**
     * @inheritdoc
     */
    clear(cacheDir) {
        for(const clearer of this._clearers) {
            clearer.clear(cacheDir);
        }
    }

    /**
     * @param {Jymfony.Component.Kernel.CacheClearer.CacheClearerInterface} clearer
     */
    add(clearer) {
        this._clearers.push(clearer);
    }
}

module.exports = ChainCacheClearer;
