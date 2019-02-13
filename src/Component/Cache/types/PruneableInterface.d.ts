declare namespace Jymfony.Component.Cache {
    /**
     * Represents a pool that allow for pruning (deletion) of expired items.
     */
    export class PruneableInterface implements MixinInterface {
        public static readonly definition: Newable<PruneableInterface>;

        /**
         * Prunes the cache pool.
         */
        prune(): Promise<boolean>;
    }
}
