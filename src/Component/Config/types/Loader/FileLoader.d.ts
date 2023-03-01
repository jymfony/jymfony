declare namespace Jymfony.Component.Config.Loader {
    import FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;

    /**
     * FileLoader is the abstract class used by all built-in loaders that are file based.
     */
    export abstract class FileLoader extends Loader {
        public static readonly loading: Set<string>;

        public currentDir: undefined | string;
        public readonly locator: FileLocatorInterface;

        protected _locator: FileLocatorInterface;
        private _currentDir: undefined | string;

        /**
         * Constructor
         */
        // @ts-ignore
        __construct(locator: FileLocatorInterface, env?: string | null): void;
        constructor(locator: FileLocatorInterface, env?: string | null);

        /**
         * Imports a resource.
         *
         * @throws {Jymfony.Component.Config.Exception.FileLoaderLoadException}
         * @throws {Jymfony.Component.Config.Exception.FileLoaderImportCircularReferenceException}
         * @throws {Jymfony.Component.Config.Exception.FileLocatorFileNotFoundException}
         */
        importResource(resource: any, type?: undefined | string, ignoreErrors?: boolean, sourceResource?: undefined | string): any;

        /**
         * @internal
         */
        protected _glob(pattern, recursive, ignoreErrors?: boolean, forExclusion?: boolean, excluded?: string[]): IterableIterator<string>;

        private _doImport(resource: any, type?: string, ignoreErrors?: boolean, sourceResource?: string): any;
    }
}
