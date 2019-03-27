declare namespace Jymfony.Component.Config.Loader {
    /**
     * Loader is the abstract class used by all built-in loaders.
     */
    export abstract class Loader extends implementationOf(LoaderInterface) {
        public resolver: LoaderResolverInterface;
        protected _resolver: LoaderResolverInterface;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Imports a resource.
         */
        importResource(resource: any, type?: string): any;

        /**
         * Finds a loader able to load an imported resource.
         *
         * @throws {Jymfony.Component.Config.Exception.FileLoaderLoadException}
         */
        resolve(resource: any, type?: string): LoaderInterface;
    }
}
