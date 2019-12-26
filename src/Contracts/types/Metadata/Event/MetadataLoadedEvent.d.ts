declare namespace Jymfony.Contracts.Metadata.Exception {
    import Event = Jymfony.Contracts.EventDispatcher.Event;

    export class MetadataLoadedEvent extends Event {
        private _metadata: MetadataInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(metadata: MetadataInterface): void;
        constructor(metadata: MetadataInterface);

        /**
         * Gets the metadata.
         */
        public readonly metadata: MetadataInterface;
    }
}
