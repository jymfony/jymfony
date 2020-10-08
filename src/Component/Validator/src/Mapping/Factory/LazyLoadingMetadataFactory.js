const AbstractMetadataFactory = Jymfony.Component.Metadata.Factory.AbstractMetadataFactory;
const ClassMetadata = Jymfony.Component.Validator.Mapping.ClassMetadata;

/**
 * Creates new {@link ClassMetadataInterface} instances.
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Factory
 */
export default class LazyLoadingMetadataFactory extends AbstractMetadataFactory {
    _createMetadata(reflectionClass) {
        return new ClassMetadata(reflectionClass);
    }
}
