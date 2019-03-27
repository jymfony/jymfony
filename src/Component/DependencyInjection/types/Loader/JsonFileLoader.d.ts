declare namespace Jymfony.Component.DependencyInjection.Loader {
    import FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;
    import FileLoader = Jymfony.Component.Config.Loader.FileLoader;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    /**
     * JsonFileLoader loads configurations from a JSON file.
     */
    export class JsonFileLoader extends FileLoader {
        private _container: ContainerBuilder;

        /**
         * Constructor.
         */
        __construct(container: ContainerBuilder, locator: FileLocatorInterface): void;
        constructor(container: ContainerBuilder, locator: FileLocatorInterface);

        /**
         * @inheritdoc
         */
        load(resource: any, type?: string): any;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;

        private _loadFromExtensions(content: string): void;
    }
}
