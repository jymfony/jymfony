const ProcessorInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface;

/**
 * Combine processors.
 *
 * @internal
 * @memberOf Jymfony.Component.Metadata.Loader.Processor
 */
export default class CompositeProcessor extends implementationOf(ProcessorInterface) {
    /**
     * Create a new instance containing specified processors.
     *
     * @param {Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface[]} processors
     */
    __construct(processors) {
        this._processors = [ ...processors ];
    }

    /**
     * @inheritdoc
     */
    process(metadata, subject) {
        for (const processor of this._processors) {
            processor.process(metadata, subject);
        }
    }
}
