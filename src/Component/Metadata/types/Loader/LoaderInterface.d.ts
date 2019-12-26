declare namespace Jymfony.Component.Metadata.Loader {
    export class LoaderInterface extends MixinInterface {
        public static readonly definition: Newable<LoaderInterface>;

        /**
         * Populate class metadata.
         */
        loadClassMetadata(metadata: ClassMetadataInterface): boolean;
    }
}
