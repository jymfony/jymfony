declare namespace Jymfony.Component.Metadata.Loader {
    import ProcessorFactoryInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorFactoryInterface;
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    export abstract class AbstractProcessorLoader extends implementationOf(LoaderInterface) {
        protected _processorFactory: ProcessorFactoryInterface;

        /**
         * Constructor.
         */
        __construct(processorFactory: ProcessorFactoryInterface): void;
        constructor(processorFactory: ProcessorFactoryInterface);

        /**
         * @inheritdoc
         */
        loadClassMetadata(classMetadata: ClassMetadataInterface): boolean;

        /**
         * Get class metadata descriptors (ex: annotation objects).
         */
        protected abstract _getClassDescriptors(reflectionClass: ReflectionClass): IterableIterator<any> | any[];

        /**
         * Get method metadata descriptors (ex: annotation objects).
         */
        protected abstract _getMethodDescriptors(reflectionMethod: ReflectionMethod): IterableIterator<any> | any[];

        /**
         * Get property metadata descriptors (ex: annotation objects).
         */
        protected abstract _getPropertyDescriptors(readable: ReflectionProperty, writable: ReflectionProperty): IterableIterator<any> | any[];

        /**
         * Get field metadata descriptors (ex: annotation objects).
         */
        protected abstract _getFieldDescriptors(reflectionField: ReflectionField): IterableIterator<any> | any[];

        /**
         * Create method metadata object.
         */
        protected _createMethodMetadata(reflectionMethod: ReflectionMethod): MetadataInterface;

        /**
         * Create property metadata object.
         */
        protected _createPropertyMetadata(readable: ReflectionProperty, writable: ReflectionProperty): MetadataInterface;

        /**
         * Create method metadata object.
         */
        protected _createFieldMetadata(reflectionField: ReflectionField): MetadataInterface;

        /**
         * Process class descriptors.
         */
        protected _processClassDescriptors(classMetadata: ClassMetadataInterface, descriptors: IterableIterator<any>): void;

        /**
         * Process method descriptors.
         */
        protected _processMethodDescriptors(metadata: ClassMetadataInterface, descriptors: IterableIterator<any>): void;

        /**
         * Process property descriptors.
         */
        protected _processPropertyDescriptors(metadata: ClassMetadataInterface, descriptors: IterableIterator<any>): void;

        /**
         * Process fields descriptors.
         */
        protected _processFieldDescriptors(metadata: ClassMetadataInterface, descriptors: IterableIterator<any>): void;

        /**
         * Call processors.
         */
        private _doLoadFromDescriptors(metadata: ClassMetadataInterface, descriptors: IterableIterator<any>): void;
    }
}
