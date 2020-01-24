declare namespace Jymfony.Component.Metadata {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    /**
     * Represents metadata for getter/setter.
     */
    export class PropertyMetadata extends implementationOf(MetadataInterface, MetadataPropertiesTrait) {
        public className: string;

        private _name: string;
        private _reflection: [ ReflectionProperty, ReflectionProperty ];

        /**
         * Constructor.
         */
        __construct(className: string, name: string): void;
        constructor(className: string, name: string);

        __sleep(): string[];

        public readonly reflection: [ ReflectionProperty, ReflectionProperty ];

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
