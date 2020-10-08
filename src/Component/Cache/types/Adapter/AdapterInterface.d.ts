declare namespace Jymfony.Component.Cache.Adapter {
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;

    /**
     * Interface for adapters managing instances of Symfony's CacheItem.
     */
    export class AdapterInterface<T = any> extends CacheItemPoolInterface.definition {
        public static readonly definition: Newable<AdapterInterface>;

        /**
         * @inheritdoc
         */
        getItem(key: string): Promise<CacheItemInterface<T>>;

        /**
         * @inheritdoc
         */
        getItem(key: string): Promise<CacheItemInterface<T>>;

        /**
         * @inheritdoc
         */
        getItem(key: string): Promise<CacheItemInterface<T>>;
    }
}
