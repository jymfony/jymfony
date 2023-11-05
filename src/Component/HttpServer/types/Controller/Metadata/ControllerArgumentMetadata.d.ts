declare namespace Jymfony.Component.HttpServer.Controller.Metadata {
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    export class ControllerArgumentMetadata extends implementationOf(MetadataInterface) {
        private _reflectionParameter: ReflectionParameter;
        private _type: any;
        private _hasDefaultValue: boolean;

        /**
         * Constructor.
         */
        __construct(reflectionParameter: ReflectionParameter): void;
        constructor(reflectionParameter: ReflectionParameter);

        /**
         * Gets the reflection parameter for the current metadata.
         */
        public readonly reflection: ReflectionParameter;

        /**
         * Gets the parameter type.
         */
        public readonly type: any;

        /**
         * @inheritdoc
         */
        merge(metadata: MetadataInterface): void;

        /**
         * @inheritdoc
         */
        public readonly name: string;

        /**
         * Gets the parameter default value (if any).
         */
        public readonly hasDefaultValue: boolean;

        /**
         * Whether the argument is a rest element.
         */
        public readonly isRestElement: boolean;

        /**
         * @inheritdoc
         */
        __sleep(): string[];
    }
}
