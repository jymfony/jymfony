require('../../../fixtures/namespace');

const CompositeProcessor = Jymfony.Component.Metadata.Loader.Processor.CompositeProcessor;
const ProcessorFactory = Jymfony.Component.Metadata.Loader.Processor.ProcessorFactory;
const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const Fixtures = Jymfony.Component.Metadata.Fixtures;
const { expect } = require('chai');

describe('[Metadata] ProcessorFactory', function () {
    it ('should throw if invalid processor is registered', () => {
        const factory = new ProcessorFactory();
        expect(() => factory.registerProcessor('Jymfony.Component.Metadata.Fixtures.Annotation', 'Object'))
            .to.throw(InvalidArgumentException);
    });

    it ('should return always the same instance if called multiple times', () => {
        const factory = new ProcessorFactory();
        factory.registerProcessor(Fixtures.Annotation, Fixtures.Processor.FakeProcessor);

        const processor = factory.getProcessor(Fixtures.Annotation);
        expect(processor).to.be.equal(factory.getProcessor(Fixtures.Annotation));
    });

    it ('should return the correct processor if an object is passed', () => {
        const factory = new ProcessorFactory();
        factory.registerProcessor(Fixtures.Annotation, Fixtures.Processor.FakeProcessor);

        const processor = factory.getProcessor(new Fixtures.Annotation());
        expect(processor).to.be.instanceOf(Fixtures.Processor.FakeProcessor);
    });

    it ('should return null if subject is unknown', () => {
        const factory = new ProcessorFactory();
        factory.registerProcessor('Object', Fixtures.Processor.FakeProcessor);

        expect(factory.getProcessor(new Fixtures.Annotation())).to.be.equal(null);
    });

    it ('should return a composite processo if more than one processor have been registered', () => {
        const factory = new ProcessorFactory();
        factory.registerProcessor(Fixtures.Annotation, Fixtures.Processor.FakeProcessor);
        factory.registerProcessor(Fixtures.Annotation, Fixtures.Processor.FakeProcessor2);
        factory.registerProcessor(Fixtures.Annotation, Fixtures.Processor.FakeProcessor3);

        expect(factory.getProcessor(Fixtures.Annotation)).to.be.instanceOf(CompositeProcessor);
    });

    it ('should register processors from iterator', () => {
        const factory = new ProcessorFactory();
        factory.registerProcessors([
            Fixtures.Processor.FakeProcessor,
            Fixtures.Processor.FakeProcessor2,
            Fixtures.Processor.FakeProcessor3,
        ]);

        expect(factory.getProcessor(Fixtures.Annotation)).to.be.instanceOf(Fixtures.Processor.FakeProcessor);
    });
});
