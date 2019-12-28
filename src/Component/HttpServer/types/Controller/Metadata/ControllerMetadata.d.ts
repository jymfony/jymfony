declare namespace Jymfony.Component.HttpServer.Controller.Metadata {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    export class ControllerMetadata extends implementationOf(MetadataInterface) {
        private _reflectionMethod: ReflectionMethod;
        private _parameters: ControllerArgumentMetadata[];

        /**
         * Constructor.
         */
        __construct(reflectionMethod: ReflectionMethod): void;
        constructor(reflectionMethod: ReflectionMethod);

        /**
         * @inheritdoc
         */
        merge(metadata: MetadataInterface): void;

        /**
         * @inheritdoc
         */
        public readonly name: string;

        /**
         * Gets the paramaters.
         */
        public readonly parameters: ControllerArgumentMetadata[];

        /**
         * @inheritdoc
         */
        __sleep(): string[];
    }
}
