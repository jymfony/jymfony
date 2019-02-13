declare namespace Jymfony.Component.Kernel.CacheWarmer {
    /**
     * Interface for classes that support warming their cache.
     */
    export class WarmableInterface implements MixinInterface {
        public static readonly definition: Newable<WarmableInterface>;

        /**
         * Warms up the cache.
         *
         * @param cacheDir The cache directory
         */
        warmUp(cacheDir: string): Promise<void>;
    }
}
