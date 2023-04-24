declare namespace Jymfony.Component.Cache.Adapter {
    import AdapterInterface = Jymfony.Component.Cache.Adapter.AdapterInterface;
    import CacheInterface = Jymfony.Contracts.Cache.CacheInterface;
    import CacheItem = Jymfony.Component.Cache.CacheItem;
    import ContractsTrait = Jymfony.Contracts.Cache.CacheTrait;
    import ProxyTrait = Jymfony.Component.Cache.Traits.ProxyTrait;
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import ValueHolder = Jymfony.Contracts.Cache.ValueHolder;

    /**
     * Caches items at warm up time using a js file.
     * Warmed up items are read-only and run-time discovered items are cached using a fallback adapter.
     */
    export class JsFileAdapter<T = any> extends implementationOf(AdapterInterface, CacheInterface, ContractsTrait, ProxyTrait) {
        private _keys: Record<string, string>;
        private _values: Record<string, any>;
        private _file: string;
        private _pool: AdapterInterface;
        private _createCacheItem: (key: string, value: T, isHit: boolean) => CacheItem<T>;

        /**
         * Constructor.
         *
         * @param file The file were values are cached
         * @param fallbackPool A pool to fallback on when an item is not hit
         */
        __construct(file: string, fallbackPool: AdapterInterface): void;
        constructor(file: string, fallbackPool: AdapterInterface);

        /**
         * @inheritdoc
         */
        close(): void;

        /**
         * @param file The JS file were values are cached
         * @param fallbackPool A pool to fallback on when an item is not hit
         */
        static create<T = any>(file: string, fallbackPool: CacheItemPoolInterface<T>): JsFileAdapter<T>;

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
        deleteItem(key: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        deleteItems(keys: string[]): Promise<boolean>;

        /**
         * @inheritdoc
         */
        save(item: CacheItem<T>): Promise<boolean>;

        /**
         * @inheritdoc
         */
        clear(prefix?: string): Promise<boolean>;

        /**
         * Store an array of cached values.
         *
         * @param values The cached values
         */
        warmUp(values: Record<string, T>): void;

        /**
         * Load the cache file.
         */
        private _initialize(): void;

        /**
         * @private
         */
        private _generateItems(items: Record<string, CacheItem<T>>): AsyncIterator<[string, CacheItem<T>]>;
    }
}
