declare namespace Jymfony.Component.Cache.Adapter {
    import AbstractAdapterTrait = Jymfony.Component.Cache.Traits.AbstractAdapterTrait;
    import CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import ContractsTrait = Jymfony.Contracts.Cache.CacheTrait;
    import LoggerAwareInterface = Jymfony.Contracts.Logger.LoggerAwareInterface;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import CacheInterface = Jymfony.Contracts.Cache.CacheInterface;

    export abstract class AbstractAdapter<T = any> extends implementationOf(AdapterInterface, CacheInterface, LoggerAwareInterface, AbstractAdapterTrait, ContractsTrait) {
        private _namespace: string;
        private _createCacheItem: (key: string, value: any, isHit: boolean) => CacheItemInterface<T>;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(namespace?: string, defaultLifetime?: number): void;
        protected constructor(namespace?: string, defaultLifetime?: number);

        /**
         * Creates a system cache pool.
         */
        static createSystemCache<T = any>(namespace: string, defaultLifetime: number, directory: string, logger?: LoggerInterface): CacheItemPoolInterface<T>;

        /**
         * Creates a connection for cache adapter.
         */
        static createConnection(dsn: string, options: any): any;

        /**
         * @inheritdoc
         */
        getItem(key: string): Promise<CacheItemInterface<T>>;

        /**
         * @inheritdoc
         */
        getItems(keys?: string[]): Promise<Map<string, CacheItemInterface<T>>>;

        /**
         * @inheritdoc
         */
        save(item: CacheItemInterface<T>): Promise<boolean>;

        /**
         * @inheritdoc
         */
        close(): Promise<void>;

        private _generateItems(items: Record<string, any>, keys: Record<string, string>): IterableIterator<[string, CacheItemInterface<T>]>;
    }
}
