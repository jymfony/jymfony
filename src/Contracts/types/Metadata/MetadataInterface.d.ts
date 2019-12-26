declare namespace Jymfony.Contracts.Metadata {
    /**
     * Represents a metadata object.
     */
    export class MetadataInterface extends MixinInterface {
        public static readonly definition: Newable<MetadataInterface>;

        /**
         * Merges with another metadata instance.
         * An {@link Jymfony.Contracts.Metadata.Exception.InvalidArgumentException} MUST be thrown
         * if the metadata is not mergeable.
         *
         * @param {Jymfony.Contracts.Metadata.MetadataInterface} metadata
         */
        merge(metadata: MetadataInterface): void;

        /**
         * Gets the name of the target class or attribute.
         */
        public readonly name: string;

        /**
         * Returns a list of properties/fields to be serialized.
         */
        __sleep(): string[];
    }
}
