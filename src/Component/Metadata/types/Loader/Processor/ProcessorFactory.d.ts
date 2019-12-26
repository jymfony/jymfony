declare namespace Jymfony.Component.Metadata.Loader.Processor {
    export class ProcessorFactory extends implementationOf(ProcessorFactoryInterface) {
        private _processors: Record<string, string | string[]>;
        private _instances: Record<string, ProcessorInterface>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Register a processor class for class.
         */
        registerProcessor(metadataClass: string, processorClass: string): void;

        /**
         * @inheritdoc
         */
        getProcessor(subject: any): ProcessorInterface | null;

        /**
         * Create a CompositeProcessor instance.
         */
        private _createComposite(processors: ProcessorInterface[]): CompositeProcessor;
    }
}
