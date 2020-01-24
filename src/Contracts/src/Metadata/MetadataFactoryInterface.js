/**
 * Represents a Metadata factory.
 * Returns instances of {@see Jymfony.Contracts.Metadata.MetadataInterface}.
 *
 * @memberOf Jymfony.Contracts.Metadata
 */
class MetadataFactoryInterface {
    /**
     * Returns a {@see Jymfony.Contracts.Metadata.MetadataInterface}
     * NOTE: if the method is called multiple times for the same subject,
     * the same metadata instance SHOULD be returned.
     *
     * @param {*} subject
     *
     * @returns {Jymfony.Contracts.Metadata.MetadataInterface}
     *
     * @throws {Jymfony.Contracts.Metadata.Exception.InvalidArgumentException}
     */
    getMetadataFor(subject) { }

    /**
     * Whether the factory has a metadata for the given subject.
     *
     * @param {*} subject
     *
     * @returns {boolean}
     */
    hasMetadataFor(subject) { }
}

export default getInterface(MetadataFactoryInterface);
