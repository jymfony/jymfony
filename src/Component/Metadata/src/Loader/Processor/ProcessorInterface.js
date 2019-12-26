/**
 * @memberOf Jymfony.Component.Metadata.Loader.Processor
 */
class ProcessorInterface {
    /**
     * Load metadata from subject.
     *
     * @param {Jymfony.Contracts.Metadata.MetadataInterface} metadata
     * @param {*} subject
     */
    process(metadata, subject) { }
}

export default getInterface(ProcessorInterface);
