declare namespace Jymfony.Component.Cache.Adapter {
    import CacheItemInterface = Jymfony.Component.Cache.CacheItemInterface;
    import CacheItemPoolInterface = Jymfony.Component.Cache.CacheItemPoolInterface;
    import LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
    import AbstractTrait = Jymfony.Component.Cache.Traits.AbstractTrait;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;

    export abstract class AbstractAdapter<T = any> extends implementationOf(CacheItemPoolInterface, LoggerAwareInterface, AbstractTrait) {
        private _namespace: string;
        private _createCacheItem: (key: string, value: any, isHit: boolean) => CacheItemInterface<T>;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(namespace?: string, defaultLifetime?: number): void;

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
