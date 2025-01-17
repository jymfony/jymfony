const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
const MappingException = Jymfony.Component.Validator.Exception.MappingException;

/**
 * Loads validation metadata from multiple {@link LoaderInterface} instances.
 *
 * Pass the loaders when constructing the chain. Once
 * {@link loadClassMetadata()} is called, that method will be called on all
 * loaders in the chain.
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class LoaderChain extends implementationOf(LoaderInterface) {
    /**
     * @type {Jymfony.Component.Metadata.Loader.LoaderInterface[]}
     *
     * @private
     */
    _loaders;

    /**
     * @param {Jymfony.Component.Metadata.Loader.LoaderInterface[]} loaders The metadata loaders to use
     *
     * @throws {Jymfony.Component.Validator.Exception.MappingException} If any of the loaders has an invalid type
     */
    __construct(loaders) {
        for (const loader of loaders) {
            if (! (loader instanceof LoaderInterface)) {
                throw new MappingException(__jymfony.sprintf('Class "%s" is expected to implement LoaderInterface.', __jymfony.get_debug_type(loader)));
            }
        }

        this._loaders = loaders;
    }

    /**
     * @inheritdoc
     */
    loadClassMetadata(metadata) {
        for (const loader of this._loaders) {
            loader.loadClassMetadata(metadata);
        }
    }

    /**
     * @returns {Jymfony.Component.Metadata.Loader.LoaderInterface[]}
     */
    get loaders() {
        return this._loaders;
    }
}
