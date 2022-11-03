const Annotation = Jymfony.Component.Metadata.Fixtures.Annotation;
const ProcessorInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface;
const Processor = Jymfony.Component.Metadata.Annotation.Processor;

/**
 * @memberOf Jymfony.Component.Metadata.Fixtures.Processor
 */
@Processor(Annotation)
export default class FakeProcessor extends implementationOf(ProcessorInterface) {
    process() { }
}
