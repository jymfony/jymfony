declare namespace Jymfony.Component.Validator.Mapping.Factory {
    import AbstractMetadataFactory = Jymfony.Component.Metadata.Factory.AbstractMetadataFactory;
    import ClassMetadata = Jymfony.Component.Validator.Mapping.ClassMetadata;

    /**
     * Creates new {@link ClassMetadataInterface} instances.
     */
    export class LazyLoadingMetadataFactory extends AbstractMetadataFactory {
        /**
         * @inheritdoc
         */
        protected _createMetadata(reflectionClass): ClassMetadata;
    }
}
