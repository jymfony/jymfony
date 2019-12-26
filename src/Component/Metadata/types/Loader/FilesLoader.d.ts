declare namespace Jymfony.Component.Metadata.Loader {
    export class FilesLoader extends ChainLoader {
        private _loaderClass: Newable<FileLoader> | string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(paths: string[], loaderClass?: Newable<FileLoader> | string): void;
        constructor(paths: string[], loaderClass?: Newable<FileLoader> | string);

        /**
         * Create an instance of LoaderInterface for the path.
         */
        protected _getLoader(path: string): LoaderInterface;
    }
}
