require('../../fixtures/namespace');

const ClassMetadata = Jymfony.Component.Metadata.ClassMetadata;
const MetadataProcessorLoader = Jymfony.Component.Metadata.Loader.MetadataProcessorLoader;
const ProcessorFactoryInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorFactoryInterface;
const ProcessorInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface;
const Fixtures = Jymfony.Component.Metadata.Fixtures;
const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;
const { ClassAnnot } = Fixtures.__namespace._classLoader.loadFile(__dirname + '/../../fixtures/decorators/ClassAnnot.js', null);
const { NotHandledAnnotation } = Fixtures.__namespace._classLoader.loadFile(__dirname + '/../../fixtures/decorators/NotHandledAnnotation.js', null);
const { MethodAnnotation1 } = Fixtures.__namespace._classLoader.loadFile(__dirname + '/../../fixtures/decorators/MethodAnnotation1.js', null);
const { MethodAnnotation2 } = Fixtures.__namespace._classLoader.loadFile(__dirname + '/../../fixtures/decorators/MethodAnnotation2.js', null);

describe('[Metadata] MetadataProcessorLoader', function () {
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

    it ('should process metadata correctly', __jymfony.Platform.hasPrivateFieldSupport() ? () => {
        const reflClass = new ReflectionClass(Fixtures.SimpleObject);
        const metadata = new ClassMetadata(reflClass);

        const processorFactory = prophet.prophesize(ProcessorFactoryInterface);
        const loader = new MetadataProcessorLoader(processorFactory.reveal());
        processorFactory.getProcessor(Argument.type(NotHandledAnnotation)).willReturn();

        const classAnnotationProcessor = prophet.prophesize(ProcessorInterface);
        classAnnotationProcessor.process(Argument.type(MetadataInterface), Argument.type(ClassAnnot))
            .shouldBeCalledTimes(1);

        processorFactory.getProcessor(Argument.type(ClassAnnot)).willReturn(classAnnotationProcessor);

        const methodAnnotationProcessor = prophet.prophesize(ProcessorInterface);
        methodAnnotationProcessor.process(Argument.type(MetadataInterface), Argument.type(MethodAnnotation1))
            .shouldBeCalledTimes(1);
        methodAnnotationProcessor.process(Argument.type(MetadataInterface), Argument.type(MethodAnnotation2))
            .shouldBeCalledTimes(1);

        processorFactory.getProcessor(Argument.type(MethodAnnotation1)).willReturn(methodAnnotationProcessor);
        processorFactory.getProcessor(Argument.type(MethodAnnotation2)).willReturn(methodAnnotationProcessor);

        loader.loadClassMetadata(metadata);
    } : undefined);
});
