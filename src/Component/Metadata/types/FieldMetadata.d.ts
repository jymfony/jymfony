declare namespace Jymfony.Component.Metadata {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    /**
     * Represents metadata for instance field.
     */
    export class FieldMetadata extends implementationOf(MetadataInterface, MetadataPropertiesTrait) {
        public className: string;

        private _name: string;
        private _reflection: ReflectionField;

        /**
         * Constructor.
         */
        __construct(className: string, name: string): void;
        constructor(className: string, name: string);

        __sleep(): string[];

        /**
         * Gets the reflection field.
         *
         * @returns {ReflectionField}
         */
        public readonly reflection: ReflectionField;

        /**
         * @inheritdoc
         */
        merge(): void;

        /**
         * @inheritdoc
         */
        public readonly name: string;
    }
}
