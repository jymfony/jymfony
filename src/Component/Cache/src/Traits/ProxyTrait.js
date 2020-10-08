const PruneableInterface = Jymfony.Component.Cache.PruneableInterface;

/**
 * @memberOf Jymfony.Component.Cache.Traits
 */
class ProxyTrait {
    /**
     * @inheritdoc
     */
    prune() {
        return this._pool instanceof PruneableInterface && this._pool.prune();
    }
}

export default getTrait(ProxyTrait);
