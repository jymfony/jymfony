declare namespace Jymfony.Component.Cache.Adapter {
    import AdapterInterface = Jymfony.Component.Cache.Adapter.AdapterInterface;
    import CacheInterface = Jymfony.Contracts.Cache.CacheInterface;
    import CacheItem = Jymfony.Component.Cache.CacheItem;
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import ContractsTrait = Jymfony.Contracts.Cache.CacheTrait;
    import ProxyTrait = Jymfony.Component.Cache.Traits.ProxyTrait;
    import PruneableInterface = Jymfony.Component.Cache.PruneableInterface;
    import ValueHolder = Jymfony.Contracts.Cache.ValueHolder;

    export class ProxyAdapter<T = any> extends implementationOf(AdapterInterface, CacheInterface, PruneableInterface, ProxyTrait, ContractsTrait) {
        private _pool: CacheInterface<T>;
        private _namespace: string;
        private _namespaceLen: number;
        private _defaultLifetime: number;
        private _createCacheItem: (key, innerItem) => (CacheItem<T>);
        private _setInnerItem: (innerItem, item) => void;

        /**
         * Constructor.
         */
        __construct(pool: CacheItemPoolInterface, namespace?: string, defaultLifetime?: number): void;
        constructor(pool: CacheItemPoolInterface, namespace?: string, defaultLifetime?: number);

        /**
         * @inheritdoc
         */
        get(key: string, callback: (item: CacheItemPoolInterface, save: ValueHolder<boolean>) => any, beta?: null | number): Promise<T>;

        /**
         * @inheritdoc
         */
        getItem(key: string): Promise<CacheItem<T>>;

        /**
         * @inheritdoc
         */
        getItems(keys?: string[]): AsyncIterator<CacheItem<T>>;

        /**
         * @inheritdoc
         */
        hasItem(key: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        clear(prefix?: string): Promise<boolean>;

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
         *
         * @returns {Promise<boolean>}
         */
        save(item: CacheItem<T>): Promise<boolean>;

        /**
         * @inheritdoc
         */
        close(): void;

        private _doSave(item: CacheItem<T>): Promise<boolean>;
        private _generateItems(items: Record<string, CacheItem<T>>): Iterator<[string, CacheItem<T>]>;
        private _getId(key: string): string;
    }
}
