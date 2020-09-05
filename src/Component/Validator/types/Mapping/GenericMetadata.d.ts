declare namespace Jymfony.Component.Validator.Mapping {
    import GenericMetadataTrait = Jymfony.Component.Validator.Mapping.GenericMetadataTrait;
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    /**
     * A generic container of {@link Constraint} objects.
     *
     * This class supports serialization and cloning.
     */
    export class GenericMetadata extends implementationOf(MetadataInterface, GenericMetadataTrait) {
        /**
         * @inheritdoc
         */
        merge(): void

        /**
         * @inheritdoc
         */
        public readonly name: string;
    }
}
