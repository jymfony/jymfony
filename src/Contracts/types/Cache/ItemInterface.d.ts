declare namespace Jymfony.Contracts.Cache {
    import CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;

    /**
     * Augments CacheItemInterface with support for tags.
     */
    export class ItemInterface extends CacheItemInterface.definition {
        /**
         * Reserved characters that cannot be used in a key or tag.
         */
        public static readonly RESERVED_CHARACTERS: string;

        /**
         * Adds a tag to a cache item.
         *
         * Tags are strings that follow the same validation rules as keys.
         *
         * @param {string|string[]} tags A tag or array of tags
         *
         * @returns {Jymfony.Contracts.Cache.ItemInterface}
         *
         * @throws {Jymfony.Contracts.Cache.Exception.InvalidArgumentException} When tag is not valid
         * @throws {Jymfony.Contracts.Cache.Exception.CacheException} When the item comes from a pool that is not tag-aware
         */
        tag(tags: string | string[]): this;
    }
}
