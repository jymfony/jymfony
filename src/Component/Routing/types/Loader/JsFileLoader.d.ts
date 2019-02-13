declare namespace Jymfony.Component.Routing.Loader {
    import FileLoader = Jymfony.Component.Config.Loader.FileLoader;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    /**
     * JsFileLoader loads routes from a js file.
     *
     * The js file is required and the collection variable can be
     * used within the file to load routes.
     */
    export class JsFileLoader extends FileLoader {
        /**
         * @inheritdoc
         */
        load(resource: any): RouteCollection;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;
    }
}
