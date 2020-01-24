declare namespace Jymfony.Component.Metadata {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    /**
     * Represents metadata for method.
     */
    export class MethodMetadata extends implementationOf(MetadataInterface, MetadataPropertiesTrait) {
        public className: string;

        private _name: string;
        private _reflectionMethod: ReflectionMethod;

        /**
         * Constructor.
         */
        __construct(className: string, name: string): void;
        constructor(className: string, name: string);

        __sleep(): string[];

        public readonly reflection: ReflectionMethod;

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
