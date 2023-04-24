declare namespace Jymfony.Component.Routing.Loader {
    import FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;
    import Parser = Jymfony.Component.Yaml.Parser;

    /**
     * YamlFileLoader loads Yaml routing files.
     */
    export class YamlFileLoader extends JsonFileLoader {
        private _yamlParser: Parser;

        __construct(locator: FileLocatorInterface, env?: string | null): void;
        constructor(locator: FileLocatorInterface, env?: string | null);

        /**
         * @inheritdoc
         */
        supports(resource: string, type?: null | string): boolean;

        /**
         * @inheritdoc
         */
        load(file: string): RouteCollection;
    }
}
