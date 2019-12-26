/**
 * @memberOf Jymfony.Component.Metadata.Loader
 */
class LoaderInterface {
    /**
     * Populate class metadata.
     *
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} metadata
     */
    loadClassMetadata(metadata) { }
}

export default getInterface(LoaderInterface);
