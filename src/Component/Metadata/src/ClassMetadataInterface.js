const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

/**
 * @memberOf Jymfony.Component.Metadata
 */
class ClassMetadataInterface extends MetadataInterface.definition {
    /**
     * Gets the ReflectionClass associated to this metadata.
     *
     * @returns {ReflectionClass}
     */
    get reflectionClass() { }

    /**
     * Returns all attributes' metadata.
     *
     * @returns {Object.<string, Jymfony.Contracts.Metadata.MetadataInterface>}
     */
    get attributesMetadata() { }

    /**
     * Returns a metadata instance for a given attribute.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Contracts.Metadata.MetadataInterface}
     */
    getAttributeMetadata(name) { }

    /**
     * Adds an attribute metadata.
     *
     * @param {Jymfony.Contracts.Metadata.MetadataInterface} metadata
     */
    addAttributeMetadata(metadata) { }
}

export default getInterface(ClassMetadataInterface);
