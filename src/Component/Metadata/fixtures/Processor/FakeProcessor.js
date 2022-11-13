const Annotation = Jymfony.Component.Metadata.Fixtures.Annotation;
const ProcessorInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface;
const Processor = Jymfony.Component.Metadata.Annotation.Processor;

/**
 * @memberOf Jymfony.Component.Metadata.Fixtures.Processor
 */
export default
@Processor(Annotation) class FakeProcessor extends implementationOf(ProcessorInterface) {
    process() { }
}
