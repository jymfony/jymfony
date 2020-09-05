declare namespace Jymfony.Component.Validator.Mapping.Factory {
    import MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;

    /**
     * Metadata factory that does not store metadata.
     *
     * This implementation is useful if you want to validate values against
     * constraints only and you don't need to add constraints to classes and
     * properties.
     */
    export class BlackHoleMetadataFactory extends implementationOf(MetadataFactoryInterface) {
        /**
         * @inheritdoc
         */
        getMetadataFor(): never;

        /**
         * @inheritdoc
         */
        hasMetadataFor(): false;
    }
}
