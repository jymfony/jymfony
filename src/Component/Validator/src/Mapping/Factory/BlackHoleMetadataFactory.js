const MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;

/**
 * Metadata factory that does not store metadata.
 *
 * This implementation is useful if you want to validate values against
 * constraints only and you don't need to add constraints to classes and
 * properties.
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Factory
 */
export default class BlackHoleMetadataFactory extends implementationOf(MetadataFactoryInterface) {
    /**
     * @inheritdoc
     */
    getMetadataFor() {
        throw new LogicException('This class does not support metadata.');
    }

    /**
     * @inheritdoc
     */
    hasMetadataFor() {
        return false;
    }
}
