declare namespace Jymfony.Component.Cache.Adapter {
    import CacheInterface = Jymfony.Contracts.Cache.CacheInterface;
    import CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;
    import LoggerAwareInterface = Jymfony.Contracts.Logger.LoggerAwareInterface;
    import ArrayTrait = Jymfony.Component.Cache.Traits.ArrayTrait;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;

    export class ArrayAdapter<T = any> extends implementationOf(AdapterInterface, CacheInterface, LoggerAwareInterface, ArrayTrait) {
        private _createCacheItem: (key: string, value: any, isHit: boolean) => CacheItemInterface<T>;
        private _logger: LoggerInterface;

        __construct(defaultLifetime?: number): void;
        constructor(defaultLifetime?: number);

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

        /**
         * @inheritdoc
         */
        deleteItems(keys: string[]): Promise<boolean>;
    }
}
