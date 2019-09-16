declare namespace Jymfony.Component.Routing.Loader {
    import FileLoader = Jymfony.Component.Config.Loader.FileLoader;

    /**
     * JsonFileLoader loads JSON routing files.
     *
     * @memberOf Jymfony.Component.Routing.Loader
     */
    export class JsonFileLoader extends FileLoader {
        /**
         * Loads a JSON file.
         *
         * @param file A JSON file path
         *
         * @returns A RouteCollection instance
         *
         * @throws {InvalidArgumentException} When a route can't be parsed because JSON is invalid
         */
        load(file: string): RouteCollection;

        /**
         * @inheritdoc
         */
        supports(resource: string, type?: null | string): boolean;

        /**
         * Loads a parsed configuration.
         */
        protected _doLoad(parsedConfig: any, path: string, file: string): RouteCollection;

        /**
         * Parses a route and adds it to the RouteCollection.
         */
        protected _parseRoute(collection: RouteCollection, name: string, config: any): void;

        /**
         * Parses an import and adds the routes in the resource to the RouteCollection.
         *
         * @param collection A RouteCollection instance
         * @param config Route definition
         * @param path Full path of the file being processed
         * @param file Loaded file name
         */
        protected _parseImport(collection: RouteCollection, config: any, path: string, file: string): void;

        /**
         * Validates the route configuration.
         *
         * @param config A resource config
         * @param name The config key
         * @param path The loaded file path
         *
         * @throws InvalidArgumentException If one of the provided config keys is not supported,
         *                                  something is missing or the combination is nonsense
         */
        private _validate(config: any, name: string, path: string): void;
    }
}
