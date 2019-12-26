declare namespace Jymfony.Contracts.Metadata {
    /**
     * Represents a Metadata factory.
     * Returns instances of {@see Jymfony.Contracts.Metadata.MetadataInterface}.
     */
    export class MetadataFactoryInterface extends MixinInterface {
        public static readonly definition: Newable<MetadataFactoryInterface>;

        /**
         * Returns a {@see Jymfony.Contracts.Metadata.MetadataInterface}
         * NOTE: if the method is called multiple times for the same subject,
         * the same metadata instance SHOULD be returned.
         *
         * @throws {Jymfony.Contracts.Metadata.Exception.InvalidArgumentException}
         */
        getMetadataFor(subject: any): MetadataInterface;

        /**
         * Whether the factory has a metadata for the given subject.
         */
        hasMetadataFor(subject: any): boolean;
    }
}
