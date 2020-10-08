declare namespace Jymfony.Component.Cache.Adapter {
    import CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;

    export class NullAdapter<T = any> extends implementationOf(CacheItemPoolInterface) {
        /**
         * @inheritdoc
         */
        getItem(key: string): Promise<CacheItemInterface<T>>;

        /**
         * @inheritdoc
         */
        getItems(keys: string[]): Promise<Map<string, CacheItemInterface<T>>>;

        /**
         * @inheritdoc
         */
        hasItem(key: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        clear(): Promise<boolean>;

        /**
         * @inheritdoc
         */
        deleteItem(key: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        deleteItems(keys: string[]): Promise<boolean>;

        /**
         * @inheritdoc
         */
        save(item: CacheItemInterface<T>): Promise<boolean>;

        /**
         * @inheritdoc
         */
        close(): Promise<void>;
    }
}
