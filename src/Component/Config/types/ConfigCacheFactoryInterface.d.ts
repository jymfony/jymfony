declare namespace Jymfony.Component.Config {
    /**
     * Interface for a ConfigCache factory. This factory creates
     * an instance of ConfigCacheInterface and initializes the
     * cache if necessary.
     */
    export class ConfigCacheFactoryInterface {
        public static readonly definition: Newable<ConfigCacheFactoryInterface>;

        /**
         * Creates a cache instance and (re-)initializes it if necessary.
         *
         * @param file The absolute cache file path
         * @param callable The callable to be executed when the cache needs to be filled (i. e. is not fresh). The cache will be passed as the only parameter to this callback
         *
         * @returns The cache instance
         */
        cache(file: string, callable: Invokable): ConfigCacheInterface;
    }
}
