declare namespace Jymfony.Component.Metadata.Factory {
    import MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

    export abstract class AbstractMetadataFactory extends implementationOf(MetadataFactoryInterface) {
        private _loader: LoaderInterface;
        private _loadedClasses: Map<string, ClassMetadataInterface>;

        /**
         * Constructor.
         */
        __construct(loader: LoaderInterface): void;
        constructor(loader: LoaderInterface);

        /**
         * @inheritdoc
         */
        getMetadataFor(subject: string | Newable<any> | object): ClassMetadataInterface;

        /**
         * @inheritdoc
         */
        hasMetadataFor(value: any): boolean;

        /**
         * Create a new instance of metadata object for this factory.
         */
         protected abstract _createMetadata(reflectionClass: ReflectionClass): ClassMetadataInterface;

        /**
         * Validate loaded metadata.
         * MUST throw {@see InvalidMetadataException} if validation error occurs.
         */
        protected _validate(classMetadata: ClassMetadataInterface): void;

        /**
         * Merges given metadata with the metadata to the metadata from superclass and
         * implemented interfaces.
         */
        protected _mergeSuperclasses(classMetadata: ClassMetadataInterface): void;

        /**
         * Gets the class name from a string or an object.
         */
        private _getClass(value: string | Newable<any> | object): string | false;
    }
}
