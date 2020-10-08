declare namespace Jymfony.Component.Cache.Traits {
    import CacheTrait = Jymfony.Contracts.Cache.CacheTrait;
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import ValueHolder = Jymfony.Contracts.Cache.ValueHolder;

    export class ContractsTrait extends CacheTrait.definition {
        public static readonly definition: Newable<ContractsTrait>;
        private _computing: Set<string>;

        __construct(): void;

        /**
         * @inheritdoc
         */
        /* private */ _doGet(pool: CacheItemPoolInterface, key: string, callback: (item: CacheItemPoolInterface, save: ValueHolder<boolean>) => any, beta?: null | number): Promise<any>;
    }
}
