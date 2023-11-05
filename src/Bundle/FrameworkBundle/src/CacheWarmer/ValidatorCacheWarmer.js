const AbstractFileCacheWarmer = Jymfony.Bundle.FrameworkBundle.CacheWarmer.AbstractFileCacheWarmer;
const LazyLoadingMetadataFactory = Jymfony.Component.Validator.Mapping.Factory.LazyLoadingMetadataFactory;
const LoaderChain = Jymfony.Component.Validator.Mapping.Loader.LoaderChain;
const JsonFileLoader = Jymfony.Component.Validator.Mapping.Loader.JsonFileLoader;

/**
 * Warms up validator metadata.
 *
 * @memberOf Jymfony.Bundle.FrameworkBundle.CacheWarmer
 */
export default class ValidatorCacheWarmer extends AbstractFileCacheWarmer {
    /**
     * @type {Jymfony.Component.Validator.ValidatorBuilder}
     *
     * @private
     */
    _validatorBuilder;

    /**
     * @param {Jymfony.Component.Validator.ValidatorBuilder} validatorBuilder
     * @param {string} jsFile The file where metadata are cached
     */
    __construct(validatorBuilder, jsFile) {
        super.__construct(jsFile);
        this._validatorBuilder = validatorBuilder;
    }

    /**
     * @inheritdoc
     */
    _doWarmUp(cacheDir, arrayAdapter) {
        const loaders = this._validatorBuilder.getLoaders();
        const metadataFactory = new LazyLoadingMetadataFactory(new LoaderChain(loaders), arrayAdapter);

        for (const loader of this._extractSupportedLoaders(loaders)) {
            for (const mappedClass of loader.getMappedClasses()) {
                if (metadataFactory.hasMetadataFor(mappedClass)) {
                    metadataFactory.getMetadataFor(mappedClass);
                }
            }
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    _warmUpArrayAdapter(arrayAdapter, values) {
        // Make sure we don't cache null values
        return super._warmUpArrayAdapter(arrayAdapter, Object.filter(values));
    }

    /**
     * @param {Jymfony.Component.Metadata.Loader.LoaderInterface[]} loaders
     *
     * @returns {Jymfony.Component.Validator.Mapping.Loader.JsonFileLoader[]}
     */
    _extractSupportedLoaders(loaders) {
        const supportedLoaders = [];

        for (const loader of loaders) {
            if (loader instanceof JsonFileLoader) {
                supportedLoaders.push(loader);
            } else if (loader instanceof LoaderChain) {
                supportedLoaders.push(...this._extractSupportedLoaders(loader.getLoaders()));
            }
        }

        return supportedLoaders;
    }
}
