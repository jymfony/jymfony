declare namespace Jymfony.Component.Metadata {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    export class ClassMetadata extends implementationOf(ClassMetadataInterface, MetadataPropertiesTrait) {
        private _reflectionClass: ReflectionClass;
        private _name: string;
        private _attributesMetadata: Record<string, MetadataInterface>;
        private _attributesNames: Map<string, string>;

        /**
         * Constructor.
         */
        __construct(reflectionClass: ReflectionClass): void;
        constructor(reflectionClass: ReflectionClass);

        __sleep(): string[];
        __wakeup(): void;

        /**
         * @inheritdoc
         */
        public readonly reflectionClass: ReflectionClass;

        /**
         * @inheritdoc
         */
        merge(metadata: MetadataInterface): void;

        /**
         * @inheritdoc
         */
        getAttributeMetadata(name: string): MetadataInterface;

        /**
         * @inheritdoc
         */
        addAttributeMetadata(metadata: MetadataInterface): void;

        /**
         * @inheritdoc
         */
        public readonly name: string;

        /**
         * @inheritdoc
         */
        public readonly attributesMetadata: Record<string, MetadataInterface>;
    }
}
