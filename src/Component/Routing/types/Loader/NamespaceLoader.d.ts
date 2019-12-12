declare namespace Jymfony.Component.Routing.Loader {
    import Loader = Jymfony.Component.Config.Loader.Loader;
    import FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;
    import GlobResource = Jymfony.Component.Config.Resource.GlobResource;

    /**
     * AnnotationDirectoryLoader loads routing information from annotations set
     * on classes and methods.
     */
    export class NamespaceLoader extends Loader {
        private _locator: FileLocatorInterface;
        private _loader: AnnotationClassLoader;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(loader: AnnotationClassLoader): void;
        constructor(loader: AnnotationClassLoader);

        /**
         * Loads from annotations from a namespace.
         *
         * @param namespace A valid namespace
         * @param type The resource type
         *
         * @throws {InvalidArgumentException} When the directory does not exist or its routes cannot be parsed
         */
        load(namespace: string | any, type?: string): RouteCollection;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;

        private _glob(): GlobResource;

        /**
         * Finds classes into a namespace.
         */
        private _findClasses(namespace: string, collection: RouteCollection): string[];
    }
}
