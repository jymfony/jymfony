/**
 * Represents a metadata object.
 *
 * @memberOf Jymfony.Contracts.Metadata
 */
class MetadataInterface {
    /**
     * Merges with another metadata instance.
     * An {@link Jymfony.Contracts.Metadata.Exception.InvalidArgumentException} MUST be thrown
     * if the metadata is not mergeable.
     *
     * @param {Jymfony.Contracts.Metadata.MetadataInterface} metadata
     */
    merge(metadata) { }

    /**
     * Gets the name of the target class or attribute.
     *
     * @returns {string}
     */
    get name() { }

    /**
     * Returns a list of properties/fields to be serialized.
     *
     * @returns {string[]}
     */
    __sleep() { }
}

export default getInterface(MetadataInterface);
