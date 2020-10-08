declare namespace Jymfony.Contracts.Cache {
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import ValueHolder = Jymfony.Contracts.Cache.ValueHolder;

    /**
     * An implementation of CacheInterface for CacheItemPoolInterface classes.
     */
    export class CacheTrait {
        public static readonly definition: Newable<CacheTrait>;

        /**
         * @inheritdoc
         */
        get(key: string, callback: (item: CacheItemPoolInterface, save: ValueHolder<boolean>) => any, beta?: null | number): Promise<any>;

        /**
         * @inheritdoc
         */
        delete(key: string): Promise<boolean>;

        private _doGet(pool: CacheItemPoolInterface, key: string, callback: (item: CacheItemPoolInterface, save: ValueHolder<boolean>) => any, beta?: null | number): Promise<any>;
    }
}
