declare namespace Jymfony.Contracts.Metadata {
    /**
     * Represents an undefined or empty metadata.
     */
    export class NullMetadata extends implementationOf(MetadataInterface) {
        private _name: string;

        /**
         * Constructor.
         */
        __construct(name: string): void;
        constructor(name: string);

        /**
         * @inheritdoc
         */
        merge(metadata: MetadataInterface): void;

        /**
         * @inheritdoc
         */
        public readonly name: string;

        /**
         * @inheritdoc
         */
        __sleep(): string[];
    }
}
