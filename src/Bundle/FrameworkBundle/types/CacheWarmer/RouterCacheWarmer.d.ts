declare namespace Jymfony.Bundle.FrameworkBundle.CacheWarmer {
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import CacheWarmerInterface = Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface;

    /**
     * Generates the router matcher and generator classes.
     *
     * @final
     */
    export class RouterCacheWarmer extends implementationOf(CacheWarmerInterface) {
        /**
         * As this cache warmer is optional, dependencies should be lazy-loaded, that's why a container should be injected.
         */
        private _container: ContainerInterface;

        /**
         * Constructor
         */
        __construct(container: ContainerInterface): void;
        constructor(container: ContainerInterface);

        /**
         * Warms up the cache.
         *
         * @param cacheDir The cache directory
         */
        warmUp(cacheDir: string): Promise<void>;

        /**
         * Checks whether this warmer is optional or not.
         */
        public readonly optional: true;
    }
}
