declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

    /**
     * Loads validation metadata from multiple {@link LoaderInterface} instances.
     *
     * Pass the loaders when constructing the chain. Once
     * {@link loadClassMetadata()} is called, that method will be called on all
     * loaders in the chain.
     */
    export class LoaderChain extends implementationOf(LoaderInterface) {
        private _loaders: LoaderInterface[];

        /**
         * @param loaders The metadata loaders to use
         *
         * @throws {Jymfony.Component.Validator.Exception.MappingException} If any of the loaders has an invalid type
         */
        __construct(loaders: LoaderInterface[]): void;
        constructor(loaders: LoaderInterface[]);

        /**
         * @inheritdoc
         */
        loadClassMetadata(metadata: ClassMetadataInterface): void;
        public readonly loaders: LoaderInterface[];
    }
}
