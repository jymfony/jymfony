declare namespace Jymfony.Component.Metadata {
    export class MetadataPropertiesTrait extends MixinInterface {
        public static readonly definition: Newable<MetadataPropertiesTrait>;

        /**
         * @see __jymfony.serialize
         */
        __sleep(): string[];

        /**
         * Gets the property names to be serialized.
         * By default returns all the non-private fields not starting with "_"
         * and the readable and writable properties not starting with "_".
         */
        private _getSerializableProperties(): string[];
    }
}
