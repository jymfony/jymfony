import { @Processor } from '@jymfony/decorators';

const ProcessorInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface;
const Annotation = Jymfony.Component.Metadata.Fixtures.Annotation;

/**
 * @memberOf Jymfony.Component.Metadata.Fixtures.Processor
 */
@Processor(Annotation)
export default class FakeProcessor extends implementationOf(ProcessorInterface) {
    process() { }
}
