/**
 * Represents a pool that allow for pruning (deletion) of expired items.
 *
 * @memberOf Jymfony.Component.Cache
 */
class PruneableInterface {
    /**
     * Prunes the cache pool.
     *
     * @returns {Promise<boolean>}
     */
    async prune() { }
}

module.exports = getInterface(PruneableInterface);
