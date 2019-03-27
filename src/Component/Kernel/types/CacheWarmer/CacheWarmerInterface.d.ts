declare namespace Jymfony.Component.Kernel.CacheWarmer {
    /**
     * Interface for classes able to warm up the cache.
     */
    export class CacheWarmerInterface extends WarmableInterface.definition {
        /**
         * Checks whether this warmer is optional or not.
         *
         * A warmer should return true is the cache can be generated
         * incrementally and on-demand.
         */
        public readonly optional: boolean;
    }
}
