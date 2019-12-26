const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

/**
 * @memberOf Jymfony.Component.Metadata.Loader
 */
export default class ChainLoader extends implementationOf(LoaderInterface) {
    /**
     * ChainLoader constructor.
     *
     * @param {Jymfony.Component.Metadata.Loader.LoaderInterface[]} loaders
     */
    __construct(loaders) {
        for (const loader of loaders) {
            if (! (loader instanceof LoaderInterface)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Class %s is expected to implement LoaderInterface', ReflectionClass.getClassName(loader)));
            }
        }

        /**
         * @type {Jymfony.Component.Metadata.Loader.LoaderInterface[]}
         *
         * @private
         */
        this._loaders = [ ...loaders ];
    }

    /**
     * @inheritdoc
     */
    loadClassMetadata(classMetadata) {
        let success = false;
        for (const loader of this._loaders) {
            success = loader.loadClassMetadata(classMetadata) || success;
        }

        return success;
    }
}
