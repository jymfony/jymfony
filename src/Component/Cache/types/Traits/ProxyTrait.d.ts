declare namespace Jymfony.Component.Cache.Traits {
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;

    export class ProxyTrait {
        private _pool: CacheItemPoolInterface;

        __construct(): void;

        /**
         * Prunes the cache pool.
         */
        prune(): Promise<boolean>;
    }
}
