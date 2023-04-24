declare namespace Jymfony.Component.DependencyInjection.Loader {
    import FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;
    import FileLoader = Jymfony.Component.Config.Loader.FileLoader;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    /**
     * JsFileLoader loads service definitions from a js file.
     *
     * The js file is required and the container variable can be
     * used within the file to change the container.
     */
    export class JsFileLoader extends FileLoader {
        private _container: ContainerBuilder;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(container: ContainerBuilder, locator: FileLocatorInterface, env?: string | null): void;
        constructor(container: ContainerBuilder, locator: FileLocatorInterface, env?: string | null);

        /**
         * @inheritdoc
         */
        load(resource: any, type?: string): any;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;
    }
}
