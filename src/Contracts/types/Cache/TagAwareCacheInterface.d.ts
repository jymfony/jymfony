declare namespace Jymfony.Contracts.Cache {
    import CacheInterface = Jymfony.Contracts.Cache.CacheInterface;

    /**
     * Allows invalidating cached items using tags.
     */
    export class TagAwareCacheInterface extends CacheInterface.definition {
        /**
         * Invalidates cached items using tags.
         *
         * When implemented on a cache pool, invalidation should not apply
         * to deferred items. Instead, they should be committed as usual.
         * This allows replacing old tagged values by new ones without
         * race conditions.
         *
         * @param {string[]} tags An array of tags to invalidate
         *
         * @returns {Promise<boolean>} true on success
         *
         * @throws {Jymfony.Contracts.Cache.Exception.InvalidArgumentException} When tags is not valid
         */
        invalidateTags(tags: string[]): Promise<boolean>;
    }
}
