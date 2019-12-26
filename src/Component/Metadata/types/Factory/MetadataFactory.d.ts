declare namespace Jymfony.Component.Metadata.Factory {
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

    export class MetadataFactory<T extends ClassMetadataInterface = any> extends AbstractMetadataFactory {
        private _metadataClass: Newable<T>;

        __construct(loader: LoaderInterface): void;
        constructor(loader: LoaderInterface);

        /**
         * Set the metadata class to be created by this factory.
         */
        public /* writeonly */ metadataClass: string | Newable<T>;

        /**
         * @inheritdoc
         */
        _createMetadata(reflectionClass: ReflectionClass): T;
    }
}
