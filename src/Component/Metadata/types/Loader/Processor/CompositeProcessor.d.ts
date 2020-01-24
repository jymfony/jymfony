declare namespace Jymfony.Component.Metadata.Loader.Processor {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    /**
     * Combine processors.
     *
     * @internal
     */
    export class CompositeProcessor extends implementationOf(ProcessorInterface) {
        private _processors: ProcessorInterface[];

        /**
         * Create a new instance containing specified processors.
         */
        __construct(processors: ProcessorInterface[]): void;
        constructor(processors: ProcessorInterface[]);

        /**
         * @inheritdoc
         */
        process(metadata: MetadataInterface, subject: any): void;
    }
}
