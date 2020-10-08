declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import AbstractLoader = Jymfony.Component.Validator.Mapping.Loader.AbstractLoader;

    /**
     * Loads validation metadata from class annotations/decorators.
     */
    export class AnnotationLoader extends AbstractLoader {
        /**
         * @inheritdoc
         */
        loadClassMetadata(metadata: ClassMetadataInterface): void;
    }
}
