declare namespace Jymfony.Component.Metadata.Loader {
    export class ChainLoader extends implementationOf(LoaderInterface) {
        private _loaders: LoaderInterface[];

        /**
         * ChainLoader constructor.
         */
        __construct(loaders: LoaderInterface[]): void;
        constructor(loaders: LoaderInterface[]);

        /**
         * @inheritdoc
         */
        loadClassMetadata(classMetadata: ClassMetadataInterface): boolean;
    }
}
