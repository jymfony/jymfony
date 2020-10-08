declare namespace Jymfony.Bundle.FrameworkBundle.CacheWarmer {
    import AbstractFileCacheWarmer = Jymfony.Bundle.FrameworkBundle.CacheWarmer.AbstractFileCacheWarmer;
    import ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
    import JsFileAdapter = Jymfony.Component.Cache.Adapter.JsFileAdapter;
    import JsonFileLoader = Jymfony.Component.Validator.Mapping.Loader.JsonFileLoader;
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
    import ValidatorBuilder = Jymfony.Component.Validator.ValidatorBuilder;

    /**
     * Warms up validator metadata.
     */
    export class ValidatorCacheWarmer extends AbstractFileCacheWarmer {
        private _validatorBuilder: ValidatorBuilder;

        /**
         * Constructor.
         *
         * @param validatorBuilder The validator builder to extract metadata from.
         * @param jsFile The file where metadata are cached
         */
        // @ts-ignore
        __construct(validatorBuilder: ValidatorBuilder, jsFile: string): void;
        constructor(validatorBuilder: ValidatorBuilder, jsFile: string);

        /**
         * @inheritdoc
         */
        protected _doWarmUp(cacheDir: string, arrayAdapter: ArrayAdapter): boolean;
        protected _warmUpArrayAdapter(arrayAdapter: JsFileAdapter, values: Record<string, any>): void;

        private _extractSupportedLoaders(loaders: LoaderInterface[]): JsonFileLoader[];
    }
}
