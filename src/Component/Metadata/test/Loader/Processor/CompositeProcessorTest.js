const CompositeProcessor = Jymfony.Component.Metadata.Loader.Processor.CompositeProcessor;
const ProcessorInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface;
const Prophet = Jymfony.Component.Testing.Prophet;
const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

describe('[Metadata] CompositeProcessor', function () {
    /**
     * @type {Jymfony.Component.Testing.Prophet}
     */
    let prophet;

    beforeEach(() => {
        prophet = new Prophet();
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        prophet.checkPredictions();
    });

    it ('should call all inner processors', () => {
        const metadata = prophet.prophesize(MetadataInterface).reveal();
        const subject = {};

        const processor1 = prophet.prophesize(ProcessorInterface);
        processor1.process(metadata, subject).shouldBeCalledTimes(1);

        const processor2 = prophet.prophesize(ProcessorInterface);
        processor2.process(metadata, subject).shouldBeCalledTimes(1);

        const processor = new CompositeProcessor([
            processor1.reveal(),
            processor2.reveal(),
        ]);

        processor.process(metadata, subject);
    });
});
