declare namespace Jymfony.Component.Metadata {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    export class ClassMetadataInterface extends MetadataInterface.definition {
        public static readonly definition: Newable<ClassMetadataInterface>;

        /**
         * Gets the ReflectionClass associated to this metadata.
         */
        public readonly reflectionClass: ReflectionClass;

        /**
         * Returns all attributes' metadata.
         */
        public readonly attributesMetadata: Record<string, MetadataInterface>;

        /**
         * Returns a metadata instance for a given attribute.
         */
        getAttributeMetadata(name: string): MetadataInterface;

        /**
         * Adds an attribute metadata.
         */
        addAttributeMetadata(metadata: MetadataInterface): void;
    }
}
