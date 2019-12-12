declare namespace Jymfony.Component.DependencyInjection.Loader {
    import BaseFileLoader = Jymfony.Component.Config.Loader.FileLoader;
    import FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;

    /**
     * FileLoader is the abstract class used by all built-in loaders that are file based.
     */
    export abstract class FileLoader extends BaseFileLoader {
        protected _container: ContainerBuilder;
        protected _isLoadingInstanceof: boolean;
        protected _instanceof: Record<string, any>;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
         * @param {Jymfony.Component.Config.FileLocatorInterface} locator
         */
        // @ts-ignore
        __construct(container: ContainerBuilder, locator: FileLocatorInterface): void;
        constructor(container: ContainerBuilder, locator: FileLocatorInterface);

        /**
         * Registers a set of classes as services using autoloader for discovery.
         *
         * @param prototype A definition to use as template
         * @param namespace The namespace prefix of classes in the scanned directory
         * @param resource The directory to look for classes, glob-patterns allowed
         * @param exclude A globbed path of files to exclude or an array of globbed paths of files to exclude
         */
        protected _registerClasses(prototype: Definition, namespace: string, resource: string, exclude?: string | string[] | null): void;

        /**
         * Registers a definition in the container with its instanceof-conditionals.
         */
        protected _setDefinition(id: string, definition: Definition): void;

        /**
         * Finds classes into a namespace.
         */
        private _findClasses(namespace: string, pattern: string, excludePatterns: string[]): Record<string, string | null>;
    }
}
