declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

    /**
     * Loads validation metadata by calling a static method on the loaded class.
     */
    export class StaticMethodLoader extends implementationOf(LoaderInterface) {
        protected _methodName: string;

        /**
         * Creates a new loader.
         *
         * @param methodName The name of the static method to call
         */
        __construct(methodName?: string): void;
        constructor(methodName?: string);

        /**
         * @inheritdoc
         */
        loadClassMetadata(metadata: ClassMetadataInterface): void;
    }
}
