const GenericMetadataTrait = Jymfony.Component.Validator.Mapping.GenericMetadataTrait;
const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

/**
 * A generic container of {@link Constraint} objects.
 *
 * This class supports serialization and cloning.
 *
 * @memberOf Jymfony.Component.Validator.Mapping
 */
export default class GenericMetadata extends implementationOf(MetadataInterface, GenericMetadataTrait) {
    /**
     * @inheritdoc
     */
    merge() {
        // Do nothing.
    }

    /**
     * @inheritdoc
     */
    get name() {
        return '';
    }
}
