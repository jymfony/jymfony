/**
 * @memberOf Jymfony.Component.Metadata.Loader.Processor
 */
class ProcessorFactoryInterface {
    /**
     * Get a processor able to handle $subject.
     *
     * @param {*} subject
     *
     * @returns {Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface|null}
     */
    getProcessor(subject) { }
}

export default getInterface(ProcessorFactoryInterface);
