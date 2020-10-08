declare namespace Jymfony.Bundle.FrameworkBundle.CacheWarmer {
    import ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
    import CacheWarmerInterface = Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface;
    import JsFileAdapter = Jymfony.Component.Cache.Adapter.JsFileAdapter;

    /**
     * @internal
     */
    export abstract class AbstractFileCacheWarmer extends implementationOf(CacheWarmerInterface) {
        private _arrayFile: string;

        /**
         * @param arrayFile The file where metadata are cached
         */
        constructor(arrayFile: string);
        __construct(arrayFile: string): void;

        /**
         * @inheritdoc
         */
        public readonly optional: boolean;

        /**
         * @inheritdoc
         */
        warmUp(cacheDir: string): void;

        /**
         * @returns {boolean} false if there is nothing to warm-up
         */
        protected abstract _doWarmUp(cacheDir: string, arrayAdapter: ArrayAdapter): boolean;
        protected _warmUpArrayAdapter(arrayAdapter: JsFileAdapter, values: Record<string, any>): void;
    }
}
