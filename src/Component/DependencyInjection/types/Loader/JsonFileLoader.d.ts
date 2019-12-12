declare namespace Jymfony.Component.DependencyInjection.Loader {
    import FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;
    import ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;

    /**
     * JsonFileLoader loads configurations from a JSON file.
     */
    export class JsonFileLoader extends FileLoader {
        /**
         * @inheritdoc
         */
        load(resource: any): void;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;

        /**
         * Parse "import" section
         */
        protected _parseImports(content: Record<string, any>, file: string): void;

        /**
         * Parses the services definitions.
         */
        protected _parseDefinitions(content: Record<string, any>, file: string): void;

        /**
         * Parse the "_defaults" service section.
         */
        protected _parseDefaults(content: Record<string, any>, file: string): void;

        /**
         * Is this definition using short syntax.
         */
        protected _isUsingShortSyntax(service: any): boolean;

        /**
         * Parses a definition.
         */
        protected _parseDefinition(id: string, service: Record<string, any> | string, file: string, defaults: Record<string, any>): void;

        /**
         * Parses a callable.
         *
         * @param callable A callable
         * @param parameter A parameter (e.g. 'factory' or 'configurator')
         * @param id A service identifier
         * @param file A parsed file
         *
         * @throws {InvalidArgumentException} When errors occur
         *
         * @returns A parsed callable
         */
        protected _parseCallable(callable: string | string[], parameter: string, id: string, file: string): string | string[] | Reference;

        /**
         * Loads a file.
         *
         * @throws {InvalidArgumentException} when the given file is not a local file or when it does not exist
         */
        protected _loadFile(file: string): any;

        /**
         * Validates a file.
         *
         * @throws {InvalidArgumentException} When service file is not valid
         */
        protected _validate(content: any, file: string): any;

        /**
         * Resolves services.
         */
        protected _resolveServices(value: any, file: string, isParameter?: boolean): string | string[] | Reference | ArgumentInterface;

        /**
         * Loads from Extensions.
         */
        protected _loadFromExtensions(content: any): void;

        /**
         * Checks the keywords used to define a service.
         *
         * @param id The service name
         * @param definition The service definition to check
         * @param file The loaded file
         */
        protected _checkDefinition(id: string, definition: any, file: string): void;
    }
}
