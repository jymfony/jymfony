const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
const FieldMetadata = Jymfony.Component.Metadata.FieldMetadata;
const MethodMetadata = Jymfony.Component.Metadata.MethodMetadata;
const PropertyMetadata = Jymfony.Component.Metadata.PropertyMetadata;

/**
 * @memberOf Jymfony.Component.Metadata.Loader
 */
export default class AbstractProcessorLoader extends implementationOf(LoaderInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Metadata.Loader.Processor.ProcessorFactoryInterface} processorFactory
     */
    __construct(processorFactory) {
        /**
         * @type {Jymfony.Component.Metadata.Loader.Processor.ProcessorFactoryInterface}
         *
         * @protected
         */
        this._processorFactory = processorFactory;
    }

    /**
     * @inheritdoc
     */
    loadClassMetadata(classMetadata) {
        const reflectionClass = classMetadata.reflectionClass;
        this._processClassDescriptors(classMetadata, this._getClassDescriptors(reflectionClass));

        for (const method of reflectionClass.methods) {
            const reflectionMethod = reflectionClass.getMethod(method);
            const attributeMetadata = this._createMethodMetadata(reflectionMethod);
            this._processMethodDescriptors(attributeMetadata, this._getMethodDescriptors(reflectionMethod));

            classMetadata.addAttributeMetadata(attributeMetadata);
        }

        for (const property of reflectionClass.properties) {
            const readable = reflectionClass.hasReadableProperty(property) ? reflectionClass.getReadableProperty(property) : null;
            const writable = reflectionClass.hasWritableProperty(property) ? reflectionClass.getWritableProperty(property) : null;

            const attributeMetadata = this._createPropertyMetadata(readable, writable);
            this._processPropertyDescriptors(attributeMetadata, this._getPropertyDescriptors(readable, writable));

            classMetadata.addAttributeMetadata(attributeMetadata);
        }

        for (const field of reflectionClass.fields) {
            const reflectionField = reflectionClass.getField(field);
            const attributeMetadata = this._createFieldMetadata(reflectionField);
            this._processFieldDescriptors(attributeMetadata, this._getFieldDescriptors(reflectionField));

            classMetadata.addAttributeMetadata(attributeMetadata);
        }

        return true;
    }

    /**
     * Get class metadata descriptors (ex: annotation objects).
     *
     * @param {ReflectionClass} reflectionClass
     *
     * @returns {*[]}
     *
     * @protected
     * @abstract
     */
    _getClassDescriptors(reflectionClass) { // eslint-disable-line no-unused-vars
        throw new Error('_getClassDescriptors MUST be implemented');
    }

    /**
     * Get method metadata descriptors (ex: annotation objects).
     *
     * @param {ReflectionMethod} reflectionMethod
     *
     * @returns {*[]}
     *
     * @protected
     * @abstract
     */
    _getMethodDescriptors(reflectionMethod) { // eslint-disable-line no-unused-vars
        throw new Error('_getMethodDescriptors MUST be implemented');
    }

    /**
     * Get property metadata descriptors (ex: annotation objects).
     *
     * @param {ReflectionProperty} readable
     * @param {ReflectionProperty} writable
     *
     * @returns {*[]}
     *
     * @protected
     * @abstract
     */
    _getPropertyDescriptors(readable, writable) { // eslint-disable-line no-unused-vars
        throw new Error('_getPropertyDescriptors MUST be implemented');
    }

    /**
     * Get field metadata descriptors (ex: annotation objects).
     *
     * @param {ReflectionField} reflectionField
     *
     * @returns {*[]}
     *
     * @protected
     * @abstract
     */
    _getFieldDescriptors(reflectionField) { // eslint-disable-line no-unused-vars
        throw new Error('_getFieldDescriptors MUST be implemented');
    }

    /**
     * Create method metadata object.
     *
     * @param {ReflectionMethod} reflectionMethod
     *
     * @returns {Jymfony.Contracts.Metadata.MetadataInterface}
     *
     * @protected
     */
    _createMethodMetadata(reflectionMethod) {
        return new MethodMetadata(reflectionMethod.reflectionClass.name, reflectionMethod.name);
    }

    /**
     * Create property metadata object.
     *
     * @param {ReflectionProperty} readable
     * @param {ReflectionProperty} writable
     *
     * @returns {Jymfony.Contracts.Metadata.MetadataInterface}
     *
     * @protected
     */
    _createPropertyMetadata(readable, writable) { // eslint-disable-line no-unused-vars
        return new PropertyMetadata(readable.reflectionClass.name, readable.name);
    }

    /**
     * Create method metadata object.
     *
     * @param {ReflectionField} reflectionField
     *
     * @returns {Jymfony.Contracts.Metadata.MetadataInterface}
     *
     * @protected
     */
    _createFieldMetadata(reflectionField) {
        return new FieldMetadata(reflectionField.reflectionClass.name, reflectionField.name);
    }

    /**
     * Process class descriptors.
     *
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} classMetadata
     * @param {*[]} descriptors
     *
     * @protected
     */
    _processClassDescriptors(classMetadata, descriptors) {
        this._doLoadFromDescriptors(classMetadata, descriptors);
    }

    /**
     * Process method descriptors.
     *
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} metadata
     * @param {*[]} descriptors
     *
     * @protected
     */
    _processMethodDescriptors(metadata, descriptors) {
        this._doLoadFromDescriptors(metadata, descriptors);
    }

    /**
     * Process property descriptors.
     *
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} metadata
     * @param {*[]} descriptors
     *
     * @protected
     */
    _processPropertyDescriptors(metadata, descriptors) {
        this._doLoadFromDescriptors(metadata, descriptors);
    }

    /**
     * Process fields descriptors.
     *
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} metadata
     * @param {*[]} descriptors
     *
     * @protected
     */
    _processFieldDescriptors(metadata, descriptors) {
        this._doLoadFromDescriptors(metadata, descriptors);
    }

    /**
     * Call processors.
     *
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} metadata
     * @param {*[]} descriptors
     *
     * @private
     */
    _doLoadFromDescriptors(metadata, descriptors) {
        for (const descriptor of descriptors) {
            const processor = this._processorFactory.getProcessor(descriptor);
            if (null === processor || undefined === processor) {
                continue;
            }

            processor.process(metadata, descriptor);
        }
    }
}
