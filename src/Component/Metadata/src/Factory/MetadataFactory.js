const AbstractMetadataFactory = Jymfony.Component.Metadata.Factory.AbstractMetadataFactory;
const ClassMetadata = Jymfony.Component.Metadata.ClassMetadata;
const ClassMetadataInterface = Jymfony.Component.Metadata.ClassMetadataInterface;
const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Metadata.Factory
 */
export default class MetadataFactory extends AbstractMetadataFactory {
    __construct(loader) {
        super.__construct(loader);

        /**
         * Metadata object to be created.
         *
         * @type {Newable<Jymfony.Component.Metadata.ClassMetadataInterface>}
         *
         * @private
         */
        this._metadataClass = ClassMetadata;
    }

    /**
     * Set the metadata class to be created by this factory.
     *
     * @param {Newable<Jymfony.Component.Metadata.ClassMetadataInterface>|string} metadataClass
     */
    set metadataClass(metadataClass) {
        try {
            const reflectionClass = new ReflectionClass(metadataClass);
            if (! reflectionClass.isInstanceOf(ClassMetadataInterface)) {
                throw new Error('Invalid class');
            }

            this._metadataClass = reflectionClass.getConstructor();
        } catch (e) {
            throw InvalidArgumentException.create(InvalidArgumentException.INVALID_METADATA_CLASS, metadataClass);
        }
    }

    /**
     * @inheritdoc
     */
    _createMetadata(reflectionClass) {
        return new (this._metadataClass)(reflectionClass);
    }
}
