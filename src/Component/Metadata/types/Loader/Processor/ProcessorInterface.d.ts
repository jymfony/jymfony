declare namespace Jymfony.Component.Metadata.Loader.Processor {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    export class ProcessorInterface extends MixinInterface {
        public static readonly definition: Newable<ProcessorInterface>;

        /**
         * Load metadata from subject.
         */
        process(metadata : MetadataInterface, subject: any): void;
    }
}
